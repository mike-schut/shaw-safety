import type { Product, Collection, PageInfo, ShopifyImage } from "@/lib/types";

type RawVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  image: { url: string; altText: string | null; width: number; height: number } | null;
};

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  featuredImage: { url: string; altText: string | null; width: number; height: number } | null;
  images: { url: string; altText: string | null; width: number; height: number }[];
  options: { id: string; name: string; values: string[] }[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  variants: RawVariant[];
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const raw: RawProduct[] = require("@/data/products.json");

function normalize(p: RawProduct): Product {
  return {
    ...p,
    images: { nodes: p.images },
    variants: { nodes: p.variants },
  };
}

const products: Product[] = raw.map(normalize);

function sortProducts(
  items: Product[],
  sortKey: string | null,
  reverse: boolean
): Product[] {
  if (!sortKey || sortKey === "MANUAL" || sortKey === "BEST_SELLING") {
    return reverse ? [...items].reverse() : items;
  }
  const sorted = [...items];
  if (sortKey === "PRICE") {
    sorted.sort(
      (a, b) =>
        parseFloat(a.priceRange.minVariantPrice.amount) -
        parseFloat(b.priceRange.minVariantPrice.amount)
    );
  } else if (sortKey === "TITLE") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  return reverse ? sorted.reverse() : sorted;
}

export async function getProduct(handle: string): Promise<Product | null> {
  return products.find((p) => p.handle === handle) ?? null;
}

export async function getProducts(options?: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}): Promise<{ nodes: Product[]; pageInfo: PageInfo }> {
  const sorted = sortProducts(
    products,
    options?.sortKey ?? null,
    options?.reverse ?? false
  );
  const limit = options?.first ?? 24;
  return {
    nodes: sorted.slice(0, limit),
    pageInfo: {
      hasNextPage: sorted.length > limit,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}

export async function getCollection(
  handle: string,
  options?: { first?: number; sortKey?: string; reverse?: boolean }
): Promise<Collection | null> {
  if (handle === "all") {
    const { nodes, pageInfo } = await getProducts(options);
    return {
      id: "all",
      handle: "all",
      title: "All Products",
      description: "",
      image: null,
      products: { nodes, pageInfo },
    };
  }
  return null;
}

export async function getCollections(): Promise<
  { id: string; handle: string; title: string; description: string; image: ShopifyImage | null }[]
> {
  return [{ id: "all", handle: "all", title: "All Products", description: "", image: null }];
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  return products.filter((p) => p.id !== productId).slice(0, 4);
}

export async function searchProducts(
  query: string,
  options?: { first?: number }
): Promise<{ nodes: Product[]; pageInfo: PageInfo }> {
  const q = query.toLowerCase();
  const matches = products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
  const limit = options?.first ?? 24;
  return {
    nodes: matches.slice(0, limit),
    pageInfo: {
      hasNextPage: matches.length > limit,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}
