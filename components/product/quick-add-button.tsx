"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import type { ProductVariant } from "@/lib/types";

type Props = {
  variant: ProductVariant;
  productHandle: string;
  productTitle: string;
  hasMultipleVariants: boolean;
};

export function QuickAddButton({ variant, productHandle, productTitle, hasMultipleVariants }: Props) {
  const { addItem, openCart } = useCart();

  if (hasMultipleVariants) {
    return (
      <Link
        href={`/products/${productHandle}`}
        className="w-full border border-gray-900 py-2 text-center text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
      >
        Select Options
      </Link>
    );
  }

  function handleAdd() {
    addItem({
      variantId: variant.id,
      productHandle,
      productTitle,
      variantTitle: variant.title,
      price: variant.price,
      image: variant.image,
      quantity: 1,
    });
    openCart();
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-brand py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
    >
      Add to Cart
    </button>
  );
}
