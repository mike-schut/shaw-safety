"use client";

import { useCart } from "@/context/cart-context";
import type { ProductVariant, ShopifyImage } from "@/lib/types";

function CartIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

type Props = {
  variant: ProductVariant;
  productHandle: string;
  productTitle: string;
};

export function AddVariantButton({ variant, productHandle, productTitle }: Props) {
  const { addItem, openCart } = useCart();

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

  if (!variant.availableForSale) {
    return (
      <button disabled className="flex w-full items-center justify-center gap-2 bg-gray-300 py-3 text-sm font-semibold text-white cursor-not-allowed">
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="flex w-full items-center justify-center gap-2 bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
    >
      <span>Add to Cart</span>
      <CartIcon />
    </button>
  );
}
