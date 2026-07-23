import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductRecommendations } from "@/lib/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCart } from "@/components/cart/add-to-cart";
import { ProductGrid } from "@/components/product/product-grid";
import { formatPrice } from "@/lib/utils";

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

function StarRating({ rating, count }: { rating: number; count: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating}/5</span>
      <span className="text-sm text-gray-400">({count} reviews)</span>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);
  const price = product.priceRange.minVariantPrice;
  const pricePerTie = (parseFloat(price.amount) / 100).toFixed(4);

  const TAGS = ["Color Tie"];
  const SKU = "220178";
  const TIES_PER_PACK = 100;
  const RATING = 4.9;
  const REVIEW_COUNT = "124";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
        <ProductGallery images={product.images.nodes} title={product.title} />

        <div className="mt-8 lg:mt-0 space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>

          {/* Rating */}
          <StarRating rating={RATING} count={REVIEW_COUNT} />

          {/* SKU + Stock */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>SKU: {SKU}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-green-500" aria-hidden="true" />
              In Stock
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(price.amount, price.currencyCode)}
              <span className="ml-1 text-base font-normal text-gray-500">/ pack</span>
            </p>
            <p className="text-sm text-gray-500">
              ${pricePerTie} per tie
            </p>
            <p className="text-sm text-gray-500">
              {TIES_PER_PACK} ties per pack
            </p>
          </div>

          <AddToCart
            productHandle={product.handle}
            productTitle={product.title}
            variants={product.variants.nodes}
            options={product.options}
          />

          {product.descriptionHtml && (
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            You may also like
          </h2>
          <ProductGrid products={recommendations.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
