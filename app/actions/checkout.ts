"use server";

import type { LocalCartItem } from "@/lib/types";

type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Builds a WooCommerce checkout URL using the native ?add-to-cart= parameter.
 * This is a pure URL redirect — no server-to-server fetch required — so it
 * works regardless of whether the hosting server can reach shop.shawsafety.com.
 *
 * WooCommerce handles adding the item to cart and redirecting to checkout
 * automatically when the URL is opened in the browser.
 *
 * For multiple cart items the first item is used, since the store currently
 * sells one product in multiple colour variants and users will have at most
 * one variant in their cart at a time.
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

    // Use the first (and typically only) cart item
    const item = items[0];
    const params = new URLSearchParams({
      "add-to-cart": item.variantId,
      quantity: String(item.quantity),
    });

    return { ok: true, url: `https://${domain}/?${params.toString()}` };
  } catch (err) {
    console.error("[checkout] unexpected error:", err);
    return { ok: false, error: "An unexpected error occurred. Please try again or call us at 330-366-8892." };
  }
}
