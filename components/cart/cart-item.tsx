"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import type { LocalCartItem } from "@/lib/types";

export function CartItem({ item }: { item: LocalCartItem }) {
  const { updateItem, removeItem } = useCart();
  const lineTotal = (parseFloat(item.price.amount) * item.quantity).toFixed(2);

  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border border-gray-200">
        {item.image && (
          <Image
            src={item.image.url}
            alt={item.image.altText ?? item.productTitle}
            fill
            className="object-cover object-center"
            sizes="80px"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${item.productHandle}`}
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            {item.productTitle}
          </Link>
          <p className="shrink-0 text-sm font-medium text-gray-900">
            {formatPrice(lineTotal, item.price.currencyCode)}
          </p>
        </div>

        {item.variantTitle && (
          <p className="mt-1 text-xs text-gray-500">{item.variantTitle}</p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => {
              const next = item.quantity - 100;
              if (next < 100) removeItem(item.variantId);
              else updateItem(item.variantId, next);
            }}
            className="flex h-6 w-6 items-center justify-center border border-gray-300 text-sm hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => updateItem(item.variantId, item.quantity + 100)}
            className="flex h-6 w-6 items-center justify-center border border-gray-300 text-sm hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            +
          </button>
          <button
            onClick={() => removeItem(item.variantId)}
            className="ml-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
