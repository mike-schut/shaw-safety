import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchInput } from "@/components/search/search-input";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: "${q}"` : "Search" };
}

async function SearchResults({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ q?: string }>;
}) {
  const { q } = await searchParamsPromise;
  const products = q ? (await searchProducts(q, { first: 48 })).nodes : [];

  return (
    <>
      <p className="text-sm text-gray-500">
        {!q
          ? "Enter a search term above."
          : products.length === 0
          ? `No results for "${q}"`
          : `${products.length} result${products.length !== 1 ? "s" : ""} for "${q}"`}
      </p>
      {products.length > 0 && <ProductGrid products={products} />}
    </>
  );
}

export default function SearchPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-lg">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>
      <Suspense fallback={<p className="text-sm text-gray-400">Searching...</p>}>
        <SearchResults searchParamsPromise={searchParams} />
      </Suspense>
    </div>
  );
}
