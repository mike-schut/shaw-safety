"use server";

import type { LocalCartItem } from "@/lib/types";

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Builds a real WooCommerce cart via the Store API and returns the
 * checkout URL carrying the resulting Cart-Token as ?sid=.
 *
 * Returns a result object instead of throwing so the client can always
 * handle the outcome — Server Action throws in Next.js 16 production can
 * escape client try/catch blocks and show the generic error page.
 */
export async function buildWooCommerceCheckoutUrl(
  items: LocalCartItem[]
): Promise<CheckoutResult> {
  try {
    const domain = process.env.WC_STORE_DOMAIN;
    if (!domain) {
      return { ok: false, error: "Store configuration missing. Please contact support." };
    }
    if (items.length === 0) {
      return { ok: false, error: "Your cart is empty." };
    }

    const base = `https://${domain}/wp-json/wc/store/v1`;

    // Bootstrap a fresh anonymous cart to get a Cart-Token
    const bootstrap = await fetch(`${base}/cart`, { cache: "no-store" });
    if (!bootstrap.ok) {
      return { ok: false, error: `Unable to reach checkout (${bootstrap.status}). Please try again.` };
    }

    const initialCartToken = bootstrap.headers.get("Cart-Token");
    if (!initialCartToken) {
      return { ok: false, error: "Checkout session could not be created. Please try again." };
    }

    let cartToken: string = initialCartToken;

    for (const item of items) {
      const reqBody = JSON.stringify({ id: Number(item.variantId), quantity: item.quantity });

      const res: Response = await fetch(`${base}/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cart-Token": cartToken,
        },
        body: reqBody,
        cache: "no-store",
      });

      if (!res.ok) {
        const resBody = await res.text().catch(() => "");
        return { ok: false, error: `Could not add item to cart (${res.status}). Please try again.` };
      }

      const renewed = res.headers.get("Cart-Token");
      if (renewed) cartToken = renewed;
    }

    return { ok: true, url: `https://${domain}/checkout?sid=${encodeURIComponent(cartToken)}` };
  } catch (err) {
    console.error("[checkout] unexpected error:", err);
    return { ok: false, error: "An unexpected error occurred. Please try again or call us at 330-366-8892." };
  }
}
