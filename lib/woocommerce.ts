import { cacheLife, cacheTag } from "next/cache";
import type { Product, Collection, PageInfo, ShopifyImage, ProductVariant } from "@/lib/types";

// ---------------------------------------------------------------------------
// Raw WooCommerce API types
// ---------------------------------------------------------------------------

type WcImage = {
  id: number;
  src: string;
  name: string;
  alt: string;
};

type WcAttribute = {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
};

type WcTag = {
  id: number;
  name: string;
  slug: string;
};

type WcMetaDatum = {
  id: number;
  key: string;
  value: unknown;
};

type WcProduct = {
  id: number;
  name: string;
  slug: string;
  status: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  stock_status: string;
  images: WcImage[];
  tags: WcTag[];
  attributes: WcAttribute[];
  variations: number[];
  meta_data: WcMetaDatum[];
};

type WcVariation = {
  id: number;
  status: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: string;
  sku: string;
  attributes: { id: number; name: string; option: string }[];
  image: WcImage | null;
  meta_data: WcMetaDatum[];
};

// ---------------------------------------------------------------------------
// Low-level fetch
// ---------------------------------------------------------------------------

const WC_BASE = `https://${process.env.WC_STORE_DOMAIN}/wp-json/wc/v3`;

function wcAuth(): string {
  const key = process.env.WC_CONSUMER_KEY ?? "";
  const secret = process.env.WC_CONSUMER_SECRET ?? "";
  return `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
}

async function wcGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  // Return empty when credentials aren't configured (build time / CI)
  if (!process.env.WC_STORE_DOMAIN || !process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
    return [] as unknown as T;
  }

  const url = new URL(`${WC_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: wcAuth(),
      // Node's fetch sends no User-Agent unless given one, unlike curl —
      // some hosting-level WAFs (SiteGround included) treat a missing
      // User-Agent as a bot signal and reject the request with a bare
      // 400. Cheap to set regardless of whether that's what happened here.
      "User-Agent": "shaw-safety-nextjs",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WooCommerce API error ${res.status} on ${path} (${url.search}): ${body}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Normalizers: WC → Product type
// ---------------------------------------------------------------------------

function normalizeImage(img: WcImage): ShopifyImage {
  return {
    url: img.src,
    altText: img.alt || null,
    width: 1000,
    height: 1000,
  };
}

function getMeta(meta: WcMetaDatum[], key: string): string | null {
  const found = meta.find((m) => m.key === key);
  if (!found) return null;
  return typeof found.value === "string" ? found.value : JSON.stringify(found.value);
}

function normalizeVariation(v: WcVariation): ProductVariant {
  const tieredRaw = getMeta(v.meta_data, "_tiered_pricing");
  const imagesRaw = getMeta(v.meta_data, "_variant_images");

  return {
    id: String(v.id),
    title: v.attributes.map((a) => a.option).join(" / "),
    availableForSale: v.purchasable && v.stock_status === "instock",
    selectedOptions: v.attributes.map((a) => ({ name: a.name, value: a.option })),
    price: {
      amount: v.price || v.regular_price || "0",
      currencyCode: "USD",
    },
    compareAtPrice: v.on_sale ? { amount: v.regular_price, currencyCode: "USD" } : null,
    image: v.image ? normalizeImage(v.image) : null,
    images: imagesRaw ? (JSON.parse(imagesRaw) as ShopifyImage[]) : undefined,
    tieredPricing: tieredRaw
      ? (JSON.parse(tieredRaw) as { minQty: number; maxQty: number | null; price: string }[])
      : undefined,
  };
}

function normalizeProduct(p: WcProduct, variations: WcVariation[]): Product {
  const prices = variations.map((v) => parseFloat(v.price || v.regular_price || "0")).filter(Boolean);
  const minPrice = prices.length ? String(Math.min(...prices)) : "0";
  const maxPrice = prices.length ? String(Math.max(...prices)) : "0";

  const variantAttributes = p.attributes.filter((a) => a.variation);
  const allImages = p.images.map(normalizeImage);

  return {
    id: String(p.id),
    handle: p.slug,
    title: p.name,
    description: p.description.replace(/<[^>]+>/g, ""),
    descriptionHtml: p.description,
    availableForSale: p.status === "publish",
    tags: p.tags.map((t) => t.name),
    featuredImage: allImages[0] ?? null,
    images: { nodes: allImages },
    options: variantAttributes.map((a) => ({
      id: String(a.id),
      name: a.name,
      values: a.options,
    })),
    priceRange: {
      minVariantPrice: { amount: minPrice, currencyCode: "USD" },
      maxVariantPrice: { amount: maxPrice, currencyCode: "USD" },
    },
    variants: { nodes: variations.map(normalizeVariation) },
  };
}

// ---------------------------------------------------------------------------
// Fetch + cache helpers
// ---------------------------------------------------------------------------

async function fetchProductWithVariations(wcProduct: WcProduct): Promise<Product> {
  const variations = await wcGet<WcVariation[]>(
    `/products/${wcProduct.id}/variations`,
    { per_page: "100" }
  );
  return normalizeProduct(wcProduct, variations);
}

// ---------------------------------------------------------------------------
// Public data API — same signatures as the old lib/products.ts
// ---------------------------------------------------------------------------

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const results = await wcGet<WcProduct[]>("/products", { slug: handle, status: "publish" });
  if (!results.length) return null;
  return fetchProductWithVariations(results[0]);
}

export async function getProducts(options?: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}): Promise<{ nodes: Product[]; pageInfo: PageInfo }> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const limit = options?.first ?? 24;

  const orderby = options?.sortKey === "PRICE"
    ? "price"
    : options?.sortKey === "TITLE"
    ? "title"
    : "date";

  const order = options?.reverse ? "asc" : "desc";

  const wcProducts = await wcGet<WcProduct[]>("/products", {
    status: "publish",
    per_page: String(limit + 1),
    orderby,
    order,
  });

  const hasNextPage = wcProducts.length > limit;
  const page = wcProducts.slice(0, limit);

  const products = await Promise.all(page.map(fetchProductWithVariations));

  return {
    nodes: products,
    pageInfo: {
      hasNextPage,
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
  "use cache";
  cacheLife("hours");
  cacheTag("products");

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

  // WooCommerce category as collection
  const categories = await wcGet<{ id: number; name: string; slug: string; description: string; image: WcImage | null }[]>(
    "/products/categories",
    { slug: handle }
  );
  if (!categories.length) return null;

  const cat = categories[0];
  const { nodes, pageInfo } = await getProducts({ ...options, first: options?.first ?? 24 });
  // Filter by category (WooCommerce doesn't filter by category slug in one call cleanly without category ID)
  const wcProducts = await wcGet<WcProduct[]>("/products", {
    category: String(cat.id),
    status: "publish",
    per_page: String((options?.first ?? 24) + 1),
  });
  const hasNextPage = wcProducts.length > (options?.first ?? 24);
  const page = wcProducts.slice(0, options?.first ?? 24);
  const products = await Promise.all(page.map(fetchProductWithVariations));

  void nodes; void pageInfo; // unused from getProducts above

  return {
    id: String(cat.id),
    handle: cat.slug,
    title: cat.name,
    description: cat.description,
    image: cat.image ? normalizeImage(cat.image) : null,
    products: {
      nodes: products,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    },
  };
}

export async function getCollections(): Promise<
  { id: string; handle: string; title: string; description: string; image: ShopifyImage | null }[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const cats = await wcGet<{ id: number; name: string; slug: string; description: string; image: WcImage | null }[]>(
    "/products/categories",
    { per_page: "100", hide_empty: "true" }
  );

  const always = [{ id: "all", handle: "all", title: "All Products", description: "", image: null }];
  const fromWc = cats.map((c) => ({
    id: String(c.id),
    handle: c.slug,
    title: c.name,
    description: c.description,
    image: c.image ? normalizeImage(c.image) : null,
  }));

  return [...always, ...fromWc];
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const all = await wcGet<WcProduct[]>("/products", {
    status: "publish",
    per_page: "5",
    exclude: productId,
  });

  return Promise.all(all.slice(0, 4).map(fetchProductWithVariations));
}

export async function searchProducts(
  query: string,
  options?: { first?: number }
): Promise<{ nodes: Product[]; pageInfo: PageInfo }> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const limit = options?.first ?? 24;

  const wcProducts = await wcGet<WcProduct[]>("/products", {
    search: query,
    status: "publish",
    per_page: String(limit + 1),
  });

  const hasNextPage = wcProducts.length > limit;
  const page = wcProducts.slice(0, limit);
  const products = await Promise.all(page.map(fetchProductWithVariations));

  return {
    nodes: products,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}
