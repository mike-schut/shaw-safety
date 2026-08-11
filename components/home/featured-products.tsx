import Image from "next/image";
import Link from "next/link";
import { ZipTieIcon } from "@/components/ui/ziptie-icon";
import { AddVariantButton } from "@/components/home/add-variant-button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

type Variant = Product["variants"]["nodes"][number];

function VariantCard({
  variant,
  product,
}: {
  variant: Variant;
  product: Product;
}) {
  return (
    <div className="flex flex-col border border-gray-200 p-4">
      <Link href={`/products/${product.handle}`} className="group block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {variant.image ? (
            <Image
              src={variant.image.url}
              alt={variant.image.altText ?? variant.title}
              fill
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">
            {product.title} — {variant.title}
          </h3>
          <p className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(variant.price.amount, variant.price.currencyCode)}
            </span>
            <span className="text-sm font-normal text-gray-500">/ 100 count bag</span>
          </p>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <AddVariantButton variant={variant} productHandle={product.handle} productTitle={product.title} />
        <Link
          href={`/products/${product.handle}`}
          className="w-full border border-gray-200 py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
        >
          More Details
        </Link>
      </div>
    </div>
  );
}

type Props = {
  headline?: string;
  product: Product | null;
};

export function FeaturedProducts({
  headline = "Top Selling Safety Ties",
  product,
}: Props) {
  const variants = (product?.variants.nodes ?? [])
    .slice()
    .sort((a, b) => {
      const order = ["yellow", "pink", "green", "orange"];
      const aIdx = order.findIndex((c) => a.title.toLowerCase().includes(c));
      const bIdx = order.findIndex((c) => b.title.toLowerCase().includes(c));
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    })
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-[1800px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center text-center">
        <ZipTieIcon className="mb-4 h-4 w-auto text-brand" />
        <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">{headline}</h2>
      </div>

      {product && variants.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {variants.map((variant) => (
            <VariantCard key={variant.id} variant={variant} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </section>
  );
}
