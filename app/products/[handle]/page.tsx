import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductRecommendations } from "@/lib/products";
import { ProductClientWrapper } from "@/components/product/product-client-wrapper";
import { TestimonialSlider } from "@/components/product/testimonial-slider";
import { SplitContent } from "@/components/home/split-content";
import { GroundDeliveryTimes } from "@/components/ground-delivery-times";
import { ProductGrid } from "@/components/product/product-grid";

type Props = {
  params: Promise<{ handle: string }>;
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

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);

  return (
    <div>
      <div style={{ backgroundColor: "#f4f5f3" }}>
        <div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8 space-y-16">
          <ProductClientWrapper product={product} />
        </div>
      </div>

      <TestimonialSlider />

      <GroundDeliveryTimes />

      <SplitContent />

      {recommendations.length > 0 && (
        <section className="mx-auto max-w-[1800px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">You may also like</h2>
          <ProductGrid products={recommendations.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
