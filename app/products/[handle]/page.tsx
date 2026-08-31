import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductRecommendations } from "@/lib/products";
import { ProductClientWrapper } from "@/components/product/product-client-wrapper";
import { GroundDeliveryTimes } from "@/components/ground-delivery-times";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/lib/types";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const { nodes } = await getProducts({ first: 100 });
    if (nodes.length > 0) return nodes.map((p) => ({ handle: p.handle }));
  } catch {
    // no products yet
  }
  return [{ handle: "_placeholder" }];
}

/** Inner server component — reads searchParams (runtime data) so the parent
 *  static shell is not poisoned, per Next.js 16 guidance. */
async function ProductSection({
  product,
  searchParamsPromise,
}: {
  product: Product;
  searchParamsPromise: Promise<Record<string, string>>;
}) {
  const sp = await searchParamsPromise;

  // Case-insensitive lookup so WooCommerce slug casing ("color"/"green")
  // matches display-name option values ("Color"/"Green").
  const initialOptions: Record<string, string> = Object.fromEntries(
    product.options.map((o) => {
      const nameLower = o.name.toLowerCase();
      const fromUrl = Object.entries(sp).find(([k]) => k.toLowerCase() === nameLower)?.[1] ?? null;
      const matched = fromUrl
        ? (o.values.find((v) => v.toLowerCase() === fromUrl.toLowerCase()) ?? null)
        : null;
      return [o.name, matched ?? o.values[0] ?? ""];
    })
  );

  return <ProductClientWrapper product={product} initialOptions={initialOptions} />;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);

  return (
    <div>
      <div style={{ backgroundColor: "#f7f8f6" }}>
        <div className="mx-auto max-w-[1440px] px-4 pt-12 pb-16 sm:px-6 lg:px-8 space-y-16">
          <Suspense fallback={<div className="h-[600px] animate-pulse bg-gray-100" />}>
            <ProductSection product={product} searchParamsPromise={searchParams} />
          </Suspense>
        </div>
      </div>

      <GroundDeliveryTimes />

      {recommendations.length > 0 && (
        <section className="mx-auto max-w-[1800px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">You may also like</h2>
          <ProductGrid products={recommendations.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
