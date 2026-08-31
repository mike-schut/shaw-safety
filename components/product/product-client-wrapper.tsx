"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ProductGallery } from "@/components/product/product-gallery";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import type { Product, PriceTier, ShopifyImage } from "@/lib/types";

const RATING = 4.9;
const REVIEW_COUNT = "124";
const SKU = "220178";
const TIES_PER_BAG = 100;
const BAGS_PER_CASE = 100;
const TIES_PER_CASE = TIES_PER_BAG * BAGS_PER_CASE; // 10,000
const TAGS = ["Color Tie"];

const HIGHLIGHTS = [
  {
    label: "11-inch",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a1 1 0 011-1h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8v3M10 8v2M13 8v3M16 8v2M19 8v2" />
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
  {
    label: "Intermodal Compliant",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// Visual explainer: 1 Case → 100 Bags → 10,000 Ties
function CaseBreakdown() {
  return (
    <div className="border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold text-amber-900">Sold by the case — minimum order is 1 case</p>
      </div>
      <div className="flex items-stretch gap-2 text-center">
        {/* Case */}
        <div className="flex-1 bg-white border border-amber-200 px-3 py-2">
          <p className="text-2xl font-black text-gray-900">1</p>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Case</p>
        </div>
        <div className="flex items-center text-amber-500 font-bold text-lg px-1">=</div>
        {/* Bags */}
        <div className="flex-1 bg-white border border-amber-200 px-3 py-2">
          <p className="text-2xl font-black text-gray-900">100</p>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Bags</p>
        </div>
        <div className="flex items-center text-amber-500 font-bold text-lg px-1">=</div>
        {/* Ties */}
        <div className="flex-1 bg-white border border-amber-200 px-3 py-2">
          <p className="text-2xl font-black text-gray-900">10,000</p>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Zip Ties</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-amber-700">Each bag contains 100 ties. You receive 100 bags per case.</p>
    </div>
  );
}

function TieredPricingTable({
  tiers,
  basePrice,
  currencyCode,
  activeBags,
}: {
  tiers: PriceTier[];
  basePrice: string;
  currencyCode: string;
  activeBags: number;
}) {
  // Only show tiers reachable at the 100-bag minimum
  const validTiers = tiers.filter((t) => t.maxQty === null || t.maxQty >= BAGS_PER_CASE);
  const basePricePerBag = parseFloat(validTiers[0]?.price ?? basePrice);

  return (
    <div className="border border-gray-200 overflow-x-auto bg-white">
      <table className="w-full min-w-[340px] text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Qty (bags)</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Price / Bag</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">You Save</th>
          </tr>
        </thead>
        <tbody>
          {validTiers.map((tier, i) => {
            const isActive =
              activeBags >= tier.minQty &&
              (tier.maxQty === null || activeBags <= tier.maxQty);
            const tierPrice = parseFloat(tier.price);
            const savePct =
              i === 0 ? null : Math.round((1 - tierPrice / basePricePerBag) * 100);
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
  const searchParams = useSearchParams();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        product.options.map((o) => {
          // Case-insensitive key + value lookup — WooCommerce can return
          // attribute names/values with different casing between the product
          // endpoint (display names) and the variation endpoint (slugs).
          const nameLower = o.name.toLowerCase();
          let fromUrl: string | null = null;
          searchParams.forEach((v, k) => {
            if (k.toLowerCase() === nameLower) fromUrl = v;
          });
          const matched = fromUrl
            ? (o.values.find((v) => v.toLowerCase() === fromUrl!.toLowerCase()) ?? null)
            : null;
          return [o.name, matched ?? o.values[0] ?? ""];
        })
      )
  );
  const [quantity, setQuantity] = useState(100); // quantity is in bags; min 100, step 100
  const [specsOpen, setSpecsOpen] = useState(true);
  const [descOpen, setDescOpen] = useState(false);
  const [mobileSliderIndex, setMobileSliderIndex] = useState(0);

  const selectedVariant =
    product.variants.nodes.find((v) =>
      v.selectedOptions.every((so) => selectedOptions[so.name] === so.value)
    ) ?? product.variants.nodes[0];

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const currencyCode = selectedVariant?.price.currencyCode ?? "USD";
  const effectivePricePerBag = getEffectivePrice(
    selectedVariant?.tieredPricing,
    selectedVariant?.price.amount ?? "0",
    quantity
  );

  const hasOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values[0] === "Default Title");

  // Gallery is scoped strictly to the selected variant: its own hero image
  // (the single "Variation image" set in WooCommerce) always at index 0,
  // followed by that variant's additional gallery images (the admin
  // "Additional variation images" field — see the shop-shaw-safety repo's
  // inc/variation-gallery.php). No shared/product-level images are mixed
  // in, and no other variant's images can leak in either — switching
  // variants should show only what belongs to the one now selected.
  const galleryImages: ShopifyImage[] = selectedVariant
    ? [selectedVariant.image, ...(selectedVariant.images ?? [])].filter(
        (img): img is ShopifyImage => img !== null && img !== undefined
      )
    : [];

  // Reset mobile slider to first image (the variant hero) whenever the variant changes
  useEffect(() => {
    setMobileSliderIndex(0);
  }, [selectedVariant?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleQtyChange(val: number) {
    const snapped = Math.round(val / 100) * 100;
    setQuantity(Math.max(100, snapped));
  }

  function handleAdd() {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: { amount: effectivePricePerBag, currencyCode },
      image: selectedVariant.image,
      quantity,
    });
    openCart();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="hidden lg:block">
        <ProductGallery
          images={galleryImages}
          title={product.title}
          resetKey={selectedVariant?.id}
        />
      </div>

      <div className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 -mt-2 lg:mt-0 lg:pt-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="border border-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{product.title}</h1>

        {/* Rating */}
        <StarRating />

        {/* SKU + Stock */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
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

        {/* Mobile image slider — hidden on desktop */}
        {galleryImages.length > 0 && (
          <div className="lg:hidden relative bg-white">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={galleryImages[mobileSliderIndex].url}
                alt={galleryImages[mobileSliderIndex].altText ?? product.title}
                fill
                loading="lazy"
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
            {galleryImages.length > 1 && (
              <>
                {/* Prev */}
                <button
                  onClick={() => setMobileSliderIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-white/80 shadow hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Next */}
                <button
                  onClick={() => setMobileSliderIndex((i) => (i + 1) % galleryImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-white/80 shadow hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMobileSliderIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === mobileSliderIndex ? "w-4 bg-gray-900" : "w-1.5 bg-gray-400"}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <p className="text-5xl font-bold text-gray-900">
            {formatPrice(effectivePricePerBag, currencyCode)}
            <span className="ml-2 text-base font-normal text-gray-500">/ 100 count bag</span>
          </p>
          <p className="text-sm text-gray-500">
            {formatPrice((parseFloat(effectivePricePerBag) * BAGS_PER_CASE).toFixed(2), currencyCode)} per case
          </p>
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
            activeBags={quantity}
          />
        )}

        {/* Quantity + Add to cart */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-medium text-gray-700">Qty (bags)</label>
            <span className="text-xs text-gray-500">
              = {(quantity * TIES_PER_BAG).toLocaleString()} ties
            </span>
          </div>
          <div className="flex items-stretch gap-3">
            {/* Quantity selector */}
            <div className="flex border border-gray-300">
              <button
                onClick={() => handleQtyChange(quantity - 100)}
                className="flex w-10 items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-medium"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min={100}
                step={100}
                value={quantity}
                onChange={(e) => handleQtyChange(parseInt(e.target.value) || 100)}
                className="w-16 border-x border-gray-300 text-center text-sm font-medium text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => handleQtyChange(quantity + 100)}
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
              className="flex flex-1 items-center justify-center gap-2 bg-brand py-3 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              <span>{isAvailable ? "Add to cart" : "Out of stock"}</span>
              {isAvailable && (
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="bg-white border border-gray-200 p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 lg:text-base">
            Subtotal ({quantity} {quantity === 1 ? "bag" : "bags"} / {(quantity * TIES_PER_BAG).toLocaleString()} zip ties)
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice((parseFloat(effectivePricePerBag) * quantity).toFixed(2), currencyCode)}
          </span>
        </div>

        {/* Minimum order callout */}
        <div className="flex items-start gap-3 border border-gray-200 bg-gray-50 px-4 py-3">
          <svg className="h-4 w-4 flex-shrink-0 mt-0.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-700">
            To maintain low prices we only sell 10,000 count cases.
          </p>
        </div>

        {/* Product highlights */}
        <div className="hidden lg:block border-t border-gray-200 pt-4">
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

        {/* Specs accordion */}
        <div className="border-t border-gray-200">
          <button
            type="button"
            onClick={() => setSpecsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between py-4 text-left"
            aria-expanded={specsOpen}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Specifications</h3>
            <svg
              className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${specsOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {specsOpen && (
            <dl className="grid grid-cols-1 gap-x-8 pb-4 sm:grid-cols-2">
              {[
                SPECS[0],
                { label: "Color", value: selectedVariant?.selectedOptions.find((o) => o.name === "Color")?.value ?? "—" },
                ...SPECS.slice(1),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-gray-200 py-2">
                  <dt className="text-sm text-gray-400">{label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Description accordion */}
        {product.descriptionHtml && (
          <div className="border-t border-gray-200">
            <button
              type="button"
              onClick={() => setDescOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-4 text-left"
              aria-expanded={descOpen}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Description</h3>
              <svg
                className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${descOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {descOpen && (
              <div
                className="prose prose-sm max-w-none text-gray-600 pb-4"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
          </div>
        )}

        {/* Separator */}
        <hr className="border-gray-200" />

        {/* Call us */}
        <p className="text-sm text-gray-600">
          Don&apos;t see what you need?{" "}
          <a href="tel:3303668892" className="font-medium text-brand underline hover:text-brand-dark">
            Call Us at 330-366-8892
          </a>
        </p>
      </div>
    </div>
  );
}
