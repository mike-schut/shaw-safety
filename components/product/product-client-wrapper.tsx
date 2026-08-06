"use client";

import React, { useState, useEffect } from "react";
import { ProductGallery } from "@/components/product/product-gallery";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import type { Product, PriceTier } from "@/lib/types";

const RATING = 4.9;
const REVIEW_COUNT = "124";
const SKU = "220178";
const TIES_PER_PACK = 100;
const TAGS = ["Color Tie"];

const HIGHLIGHTS = [
  {
    label: "11-inch",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    ),
  },
  {
    label: "High Visibility",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: "75 lbs",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const SPECS = [
  { label: "Length", value: "11-inch" },
  { label: "Tensile Strength (lbs.)", value: "75" },
  { label: "Thickness (mm)", value: "1.3" },
  { label: "Width (mm)", value: "4.4" },
  { label: "Cable Tie Style", value: "Standard" },
  { label: "Bundle Diameter (in.)", value: "3" },
  { label: "Material", value: "Nylon 6/6" },
  { label: "Ties Per Pack", value: "100" },
  { label: "Ties Per Case", value: "10,000" },
  { label: "UL Listing", value: "UL94 V2, UL62275, Type 21S" },
  { label: "UV Rated", value: "No" },
  { label: "Temperature Range", value: "-40ºF to +185ºF" },
];

function getEffectivePrice(tiers: PriceTier[] | undefined, basePrice: string, qty: number): string {
  if (!tiers || tiers.length === 0) return basePrice;
  const tier = tiers.find((t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
  return tier?.price ?? basePrice;
}

function TruckIcon({ className = "h-4 w-4 flex-shrink-0" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 0M13 16l2 0m0 0h2.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0021 12.586V10a1 1 0 00-1-1h-4a1 1 0 00-1 1v6zm0 0H9" />
    </svg>
  );
}

const NEXT_BUSINESS_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function nextBusinessDay(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

function ShippingEstimate({
  quantity,
  priceAmount,
  currencyCode,
}: {
  quantity: number;
  priceAmount: string;
  currencyCode: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const subtotal = (parseFloat(priceAmount) * quantity).toFixed(2);

  let shippingLine: React.ReactNode = null;
  if (now) {
    const cutoffToday = new Date(now);
    cutoffToday.setHours(17, 0, 0, 0);
    const beforeCutoff = now < cutoffToday;
    const orderDay = beforeCutoff ? now : new Date(now.getTime() + 86_400_000);
    const shipDate = nextBusinessDay(orderDay);
    const nextCutoff = beforeCutoff
      ? cutoffToday
      : new Date(cutoffToday.getTime() + 86_400_000);
    const diff = Math.max(0, nextCutoff.getTime() - now.getTime());
    const hrs = Math.floor(diff / 3_600_000);
    const mins = Math.floor((diff % 3_600_000) / 60_000);
    const dayLabel = NEXT_BUSINESS_DAY_NAMES[shipDate.getDay()];
    const month = shipDate.getMonth() + 1;
    const date = shipDate.getDate();
    shippingLine = (
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <TruckIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          Ships{" "}
          <span className="font-semibold text-gray-900">
            {dayLabel} {month}/{date}
          </span>{" "}
          if ordered in the next{" "}
          <span className="font-semibold text-gray-900">
            {hrs} hrs {mins} mins
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4">
      {/* Next-day shipping notice */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <TruckIcon />
        <span>Ships next day if you order before 5pm</span>
      </div>

      {/* Subtotal + live shipping estimate */}
      <div className="bg-gray-50 border border-gray-200 p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({quantity} {quantity === 1 ? "pack" : "packs"})
          </span>
          <span className="font-semibold text-gray-900">
            {formatPrice(subtotal, currencyCode)}
          </span>
        </div>
        {shippingLine}
      </div>
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= Math.round(RATING) ? "text-yellow-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{RATING}/5</span>
      <span className="text-sm text-gray-400">({REVIEW_COUNT} reviews)</span>
    </div>
  );
}

function TieredPricingTable({
  tiers,
  basePrice,
  currencyCode,
  activeQty,
}: {
  tiers: PriceTier[];
  basePrice: string;
  currencyCode: string;
  activeQty: number;
}) {
  const base = parseFloat(tiers[0]?.price ?? basePrice);

  return (
    <div className="border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Qty (packs)</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Price / Pack</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">You Save</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => {
            const isActive =
              activeQty >= tier.minQty && (tier.maxQty === null || activeQty <= tier.maxQty);
            const tierPrice = parseFloat(tier.price);
            const savePct = i === 0 ? null : Math.round((1 - tierPrice / base) * 100);
            const label =
              tier.maxQty === null
                ? `${tier.minQty}+`
                : `${tier.minQty}–${tier.maxQty}`;

            return (
              <tr
                key={i}
                className={`border-b border-gray-100 last:border-0 transition-colors ${
                  isActive ? "bg-brand/10" : ""
                }`}
              >
                <td className={`px-4 py-2.5 ${isActive ? "font-semibold text-brand" : "text-gray-700"}`}>
                  {label}
                </td>
                <td className={`px-4 py-2.5 ${isActive ? "font-semibold text-brand" : "text-gray-700"}`}>
                  {formatPrice(tier.price, currencyCode)}
                </td>
                <td className="px-4 py-2.5 text-gray-500">
                  {savePct ? (
                    <span className="text-green-600 font-medium">{savePct}% off</span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type Props = {
  product: Product;
};

export function ProductClientWrapper({ product }: Props) {
  const { addItem, openCart } = useCart();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => Object.fromEntries(product.options.map((o) => [o.name, o.values[0] ?? ""]))
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant =
    product.variants.nodes.find((v) =>
      v.selectedOptions.every((so) => selectedOptions[so.name] === so.value)
    ) ?? product.variants.nodes[0];

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const currencyCode = selectedVariant?.price.currencyCode ?? "USD";
  const effectivePriceAmount = getEffectivePrice(
    selectedVariant?.tieredPricing,
    selectedVariant?.price.amount ?? "0",
    quantity
  );
  const perTie = (parseFloat(effectivePriceAmount) / TIES_PER_PACK).toFixed(4);

  const hasOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values[0] === "Default Title");

  // Prefer per-variant image list; fall back to filtering the product-level images
  const galleryImages: typeof product.images.nodes = selectedVariant?.images?.length
    ? selectedVariant.images
    : (() => {
        const otherVariantImageUrls = new Set(
          product.variants.nodes
            .filter((v) => v.id !== selectedVariant?.id)
            .map((v) => v.image?.url)
            .filter(Boolean) as string[]
        );
        return product.images.nodes.filter((img) => !otherVariantImageUrls.has(img.url));
      })();

  function handleQtyChange(val: number) {
    setQuantity(Math.max(1, val));
  }

  function handleAdd() {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: { amount: effectivePriceAmount, currencyCode },
      image: selectedVariant.image,
      quantity,
    });
    openCart();
  }

  return (
    <div className="grid gap-12" style={{ grid: 'auto / minmax(0, 1.28fr) minmax(0, 0.72fr)' }}>
      <ProductGallery
        images={galleryImages}
        title={product.title}
        activeImageUrl={selectedVariant?.image?.url}
      />

      <div className="mt-8 lg:mt-0 space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-gray-900">{product.title}</h1>

        {/* Rating */}
        <StarRating />

        {/* SKU + Stock */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>SKU: <strong>{SKU}</strong></span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 flex-shrink-0"
              style={{ borderRadius: "50%", backgroundColor: "#7ebc00" }}
              aria-hidden="true"
            />
            <span style={{ color: "#7ebc00" }} className="font-medium">In Stock</span>
          </span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(effectivePriceAmount, currencyCode)}
            <span className="ml-1 text-base font-normal text-gray-500">/ pack</span>
          </p>
          <p className="text-sm text-gray-500">${perTie} per tie</p>
          <p className="text-sm text-gray-500"><strong>{TIES_PER_PACK}</strong> ties per pack</p>
        </div>

        {/* Variant options */}
        {hasOptions && (
          <div className="space-y-4">
            {product.options.map((option) => (
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
          </div>
        )}

        {/* Tiered pricing table */}
        {selectedVariant?.tieredPricing && selectedVariant.tieredPricing.length > 0 && (
          <TieredPricingTable
            tiers={selectedVariant.tieredPricing}
            basePrice={selectedVariant.price.amount}
            currencyCode={currencyCode}
            activeQty={quantity}
          />
        )}

        {/* Quantity + Add to cart */}
        <div className="flex items-stretch gap-3">
          {/* Quantity selector */}
          <div className="flex border border-gray-300">
            <button
              onClick={() => handleQtyChange(quantity - 1)}
              className="flex w-10 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
              className="w-14 border-x border-gray-300 text-center text-sm font-medium text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => handleQtyChange(quantity + 1)}
              className="flex w-10 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className="flex-1 bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isAvailable ? "Add to cart" : "Out of stock"}
          </button>
        </div>

        {/* Shipping estimate + subtotal */}
        <ShippingEstimate
          quantity={quantity}
          priceAmount={effectivePriceAmount}
          currencyCode={currencyCode}
        />

        {/* Product highlights */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Highlights</h3>
          <div className="flex flex-wrap gap-4">
            {HIGHLIGHTS.map(({ label, icon }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="flex h-8 w-8 items-center justify-center bg-brand/10 text-brand">
                  {icon}
                </span>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Specs</h3>
          <dl className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8">
            {[
              SPECS[0],
              { label: "Color", value: selectedVariant?.selectedOptions.find((o) => o.name === "Color")?.value ?? "—" },
              ...SPECS.slice(1),
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col border-b border-gray-100 pb-2">
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Description */}
        {product.descriptionHtml && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">Description</h3>
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        )}

        {/* Separator */}
        <hr className="border-gray-200" />

        {/* Call us */}
        <p className="text-sm text-gray-600">
          Don&apos;t see what you need?{" "}
          <a href="#" className="font-medium text-brand underline hover:text-brand-dark">
            Call Us
          </a>
        </p>
      </div>
    </div>
  );
}
