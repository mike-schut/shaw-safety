import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCollection, getCollections, getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelector } from "@/components/collection/sort-selector";
import type { Product } from "@/lib/types";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  if (handle === "all") return { title: "All Products" };
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection Not Found" };
  return { title: collection.title };
}

export async function generateStaticParams() {
  try {
    const collections = await getCollections();
    return [
      { handle: "all" },
      ...collections.map((c) => ({ handle: c.handle })),
    ];
  } catch {
    return [{ handle: "all" }];
  }
}

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "MANUAL", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  "title-asc": { sortKey: "TITLE", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED", reverse: true },
};

async function CollectionProducts({
  handle,
  searchParamsPromise,
}: {
  handle: string;
  searchParamsPromise: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParamsPromise;
  const sortOption = SORT_MAP[sort ?? "featured"] ?? SORT_MAP.featured;

  let title = "All Products";
  let products: Product[] = [];

  if (handle === "all") {
    const result = await getProducts({ first: 48, ...sortOption });
    products = result.nodes;
  } else {
    const collection = await getCollection(handle, { first: 48, ...sortOption });
    if (!collection) notFound();
    title = collection.title;
    products = collection.products.nodes;
  }

  return (
    <>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <Suspense>
          <SortSelector />
        </Suspense>
      </div>
      <ProductGrid products={products} />
    </>
  );
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Suspense fallback={<div className="h-8 w-48 animate-pulse bg-gray-100" />}>
        <CollectionProducts handle={handle} searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}
