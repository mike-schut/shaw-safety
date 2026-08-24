"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/context/cart-context";
import { CartItem } from "@/components/cart/cart-item";
import { formatPrice } from "@/lib/utils";
import { buildWooCommerceCheckoutUrl } from "@/app/actions/checkout";

export function CartPageClient() {
  const { cart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const items = cart.items;
  const total = cart.cost.totalAmount;

  function handleCheckout() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await buildWooCommerceCheckoutUrl(items);
        if (result.ok) {
          window.location.href = result.url;
        } else {
          setError(result.error);
        }
      } catch {
        setError("Checkout failed. Please try again or call us at 330-366-8892.");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-gray-200 border-t border-b">
        {items.map((item) => (
          <CartItem key={item.variantId} item={item} />
        ))}
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex justify-between text-base font-medium">
          <span>Subtotal</span>
          <span>{formatPrice(total.amount, total.currencyCode)}</span>
        </div>
        <p className="text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={isPending}
          className="block w-full bg-gray-900 py-3 text-center text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Preparing checkout…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
