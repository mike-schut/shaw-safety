"use server";

import type { LocalCartItem } from "@/lib/types";

/**
 * Builds a real WooCommerce cart via the Store API and returns the
 * shop.shawsafety.com checkout URL carrying the resulting Cart-Token as
 * ?sid=. That token is the WooCommerce theme's entire access-gate +
 * cart-identity mechanism on the other side of this handoff — see the
 * shop-shaw-safety repo's README for how it's consumed there.
 *
 * Runs server-side (Server Action) rather than in the browser: Store API
 * calls made from browser JS on this app's domain would hit CORS, since
 * shop.shawsafety.com is a different origin. Server-to-server has no such
 * restriction — CORS is a browser-only concept.
 *
 * Returns the URL rather than calling next/navigation's redirect()
 * itself, deliberately — redirect() throws internally, and callers here
 * wrap this in a try/catch for error handling, which would silently
 * swallow that throw. Returning a plain string sidesteps that entirely
 * and is arguably more correct anyway: this hands off to a different
 * domain, so the caller should do a real browser navigation
 * (window.location.href), not an App Router transition.
 */
export async function buildWooCommerceCheckoutUrl(items: LocalCartItem[]): Promise<string> {
  const domain = process.env.WC_STORE_DOMAIN;
  if (!domain) {
    throw new Error("WC_STORE_DOMAIN is not configured");
  }
  if (items.length === 0) {
    throw new Error("Cart is empty");
  }

  const base = `https://${domain}/wp-json/wc/store/v1`;

  // add-item rejects requests carrying neither a Nonce Token nor a
  // Cart-Token, and we start with neither (no browser, no cookies here).
  // A bare GET on /cart mints a fresh anonymous cart and returns its
  // Cart-Token in the response header; every call after this one echoes
  // that token back so items land in the same cart instead of each
  // starting a new one.
  const bootstrap = await fetch(`${base}/cart`, { cache: "no-store" });
  if (!bootstrap.ok) {
    throw new Error(`WooCommerce cart bootstrap failed (${bootstrap.status})`);
  }

  const initialCartToken = bootstrap.headers.get("Cart-Token");
  if (!initialCartToken) {
    throw new Error("WooCommerce did not return a Cart-Token");
  }
  // Declared as plain `string` (not the `string | null` fetch headers
  // normally infer) and reassigned later in this same loop — leaving it
  // inferred here creates a circular type dependency with `res` below
  // (res's type feeds cartToken's narrowing via `renewed`, while
  // cartToken feeds the headers object res is built from).
  let cartToken: string = initialCartToken;

  for (const item of items) {
    const res: Response = await fetch(`${base}/cart/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },
      // `id` alone (the variation's own WC post ID, as produced by
      // lib/woocommerce.ts's normalizeVariation) is documented as
      // sufficient — no separate `variation` attributes array needed
      // when you already have a specific variation ID rather than a
      // parent product ID + chosen options. If this ever errors demanding
      // that array anyway, LocalCartItem doesn't currently carry
      // selectedOptions to build one — that'd need adding to the cart
      // type first.
      body: JSON.stringify({ id: Number(item.variantId), quantity: item.quantity }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`WooCommerce cart/add-item failed for variant ${item.variantId} (${res.status}): ${body}`);
    }

    // Cart-Token is re-issued (renewed expiry) on every response — keep
    // using whichever is most recent for the next call.
    const renewed = res.headers.get("Cart-Token");
    if (renewed) cartToken = renewed;
  }

  return `https://${domain}/checkout?sid=${encodeURIComponent(cartToken)}`;
}
