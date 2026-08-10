import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelector } from "@/components/collection/sort-selector";

export const metadata: Metadata = {
  title: "All Products",
};

type Props = {
  searchParams: Promise<{ sort?: string }>;
};

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "MANUAL", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  "title-asc": { sortKey: "TITLE", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED", reverse: true },
};

async function ShopProducts({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParamsPromise;
  const sortOption = SORT_MAP[sort ?? "featured"] ?? SORT_MAP.featured;

  const result = await getProducts({ first: 48, ...sortOption });

  return (
    <>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">All Products</h1>
        <Suspense>
          <SortSelector />
        </Suspense>
      </div>
      <ProductGrid products={result.nodes} />
    </>
  );
}

export default async function ShopPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Suspense fallback={<div className="h-8 w-48 animate-pulse bg-gray-100" />}>
        <ShopProducts searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}
