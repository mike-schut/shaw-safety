"use server";

import type { LocalCartItem } from "@/lib/types";

type CheckoutResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Builds a real WooCommerce cart via the Store API and returns the
 * shop.shawsafety.com checkout URL carrying the resulting Cart-Token as
 * ?sid=. That token is the WooCommerce theme's entire access-gate +
 * cart-identity mechanism on the other side of this handoff (inc/gate.php,
 * inc/session-bridge.php in the shop-shaw-safety repo) — a URL without a
 * valid sid gets redirected straight back to shawsafety.com by that gate,
 * regardless of what page it points at. A prior version of this file was
 * rewritten (across several commits, apparently while chasing a production
 * error) to use WooCommerce's classic `?add-to-cart=` URL parameter
 * instead, redirecting to the homepage with no sid at all — which the
 * WordPress-side gate would reject outright, on top of only handling the
 * cart's first item and dropping the rest. Restored to the Store API
 * approach; see the shop-shaw-safety repo's README for the full
 * architecture this depends on.
 *
 * Runs server-side (Server Action) rather than in the browser: Store API
 * calls made from browser JS on this app's domain would hit CORS, since
 * shop.shawsafety.com is a different origin. Server-to-server has no such
 * restriction — CORS is a browser-only concept. (A later, uncommitted
 * attempt moved this client-side specifically to work around a production
 * error, on the unverified assumption that the production host's network
 * couldn't reach shop.shawsafety.com — on Railway, that's not a real
 * constraint; the actual cause was very likely the WC_STORE_DOMAIN /
 * WC_CONSUMER_KEY / WC_CONSUMER_SECRET environment variables never having
 * been added to the Railway service, only ever existing in local
 * .env/.env.local files that are never deployed.)
 *
 * Returns a result object rather than throwing or calling next/navigation's
 * redirect() itself — redirect() throws internally, and callers here wrap
 * this in a try/catch for error handling, which would silently swallow
 * that throw. Returning { ok, url } / { ok, error } sidesteps that
 * entirely and lets the caller do a real browser navigation
 * (window.location.href) on success, or show a message on failure.
 */
export async function buildWooCommerceCheckoutUrl(items: LocalCartItem[]): Promise<CheckoutResult> {
  try {
    const domain = process.env.WC_STORE_DOMAIN;
    if (!domain) {
      return { ok: false, error: "Store configuration missing. Please contact support." };
    }
    if (items.length === 0) {
      return { ok: false, error: "Your cart is empty." };
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
      return { ok: false, error: `Unable to reach checkout (${bootstrap.status}). Please try again.` };
    }

    const initialCartToken = bootstrap.headers.get("Cart-Token");
    if (!initialCartToken) {
      return { ok: false, error: "Checkout session could not be created. Please try again." };
    }

    let cartToken: string = initialCartToken;

    for (const item of items) {
      const res: Response = await fetch(`${base}/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cart-Token": cartToken,
        },
        body: JSON.stringify({ id: Number(item.variantId), quantity: item.quantity }),
        cache: "no-store",
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`[checkout] add-item failed for variant ${item.variantId} (${res.status}): ${body}`);
        return { ok: false, error: `Could not add item to cart (${res.status}). Please try again.` };
      }

      // Cart-Token is re-issued (renewed expiry) on every response — keep
      // using whichever is most recent for the next call.
      const renewed = res.headers.get("Cart-Token");
      if (renewed) cartToken = renewed;
    }

    return { ok: true, url: `https://${domain}/checkout?sid=${encodeURIComponent(cartToken)}` };
  } catch (err) {
    console.error("[checkout] unexpected error:", err);
    return {
      ok: false,
      error: "An unexpected error occurred. Please try again or call us at 330-366-8892.",
    };
  }
}
