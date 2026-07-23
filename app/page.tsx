import type { Metadata } from "next";
import { getProduct } from "@/lib/products";
import { Hero } from "@/components/home/hero";
import { TrustBanner } from "@/components/home/trust-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FeatureSplit } from "@/components/home/feature-split";
import { MarqueeStrip } from "@/components/home/marquee-strip";
import { CenteredPromo } from "@/components/home/centered-promo";
import { FullBleedCta } from "@/components/home/full-bleed-cta";
import { SplitContent } from "@/components/home/split-content";

export const metadata: Metadata = {
  title: "Shaw Safety — Security Ties & Container Security Products",
};

const FEATURED_PRODUCT_HANDLE =
  "11-inch-zip-tie-100-pack";

export default async function HomePage() {
  const featuredProduct = await getProduct(FEATURED_PRODUCT_HANDLE);

  return (
    <>
      <Hero />
      <TrustBanner />
      <FeaturedProducts product={featuredProduct} />
      <FeatureSplit />
      <MarqueeStrip />
      <CenteredPromo />
      <FullBleedCta />
      <SplitContent />
    </>
  );
}
