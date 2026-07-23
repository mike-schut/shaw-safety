"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import type { ProductVariant, ProductOption } from "@/lib/types";

type Props = {
  productHandle: string;
  productTitle: string;
  variants: ProductVariant[];
  options: ProductOption[];
};

export function AddToCart({ productHandle, productTitle, variants, options }: Props) {
  const { addItem, openCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => Object.fromEntries(options.map((o) => [o.name, o.values[0] ?? ""]))
  );

  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every((so) => selectedOptions[so.name] === so.value)
  );

  const isAvailable = selectedVariant?.availableForSale ?? false;

  function handleAdd() {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productHandle,
      productTitle,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: selectedVariant.image,
      quantity: 1,
    });
    openCart();
  }

  const hasOptions =
    options.length > 0 &&
    !(options.length === 1 && options[0].values[0] === "Default Title");

  return (
    <div className="space-y-4">
      {hasOptions &&
        options.map((option) => (
          <div key={option.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                return (
                  <button
                    key={value}
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                    }
                    className={`border px-3 py-1.5 text-sm transition-colors ${
                      isSelected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      <button
        onClick={handleAdd}
        disabled={!isAvailable}
        className="w-full bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {isAvailable ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  );
}
