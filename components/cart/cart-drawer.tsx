"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { CartItem } from "./cart-item";
import { formatPrice } from "@/lib/utils";
import { buildWooCommerceCheckoutUrl } from "@/app/actions/checkout";

export function CartDrawer() {
  const { cart, isOpen, closeCart } = useCart();
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">
            Cart{" "}
            {cart.totalQuantity > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({cart.totalQuantity})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close cart"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-gray-500">Your cart is empty.</p>
              <button onClick={closeCart} className="text-sm underline">
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem key={item.variantId} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>{formatPrice(total.amount, total.currencyCode)}</span>
            </div>
            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full border border-gray-900 py-3 text-center text-sm font-medium hover:bg-gray-50"
              >
                View cart
              </Link>
              <button
                onClick={handleCheckout}
                disabled={isPending}
                className="w-full bg-gray-900 py-3 text-center text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Preparing checkout…" : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
