import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { cacheTag, cacheLife } from "next/cache";
import type {
  Cart,
  Collection,
  Product,
  SearchResult,
} from "./types";
import {
  GET_PRODUCT_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
} from "./queries/product";
import {
  GET_COLLECTION_QUERY,
  GET_COLLECTIONS_QUERY,
} from "./queries/collection";
import {
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
} from "./queries/cart";
import { SEARCH_QUERY, PREDICTIVE_SEARCH_QUERY } from "./queries/search";

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2026-07",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { data, errors } = await client.request<T>(query, { variables });
  if (errors?.graphQLErrors?.length) {
    throw new Error(errors.graphQLErrors[0].message);
  }
  if (data === undefined || data === null) {
    throw new Error("Shopify API returned no data");
  }
  return data;
}

// Products

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products", `product:${handle}`);

  try {
    const data = await shopifyFetch<{ product: Product | null }>(
      GET_PRODUCT_QUERY,
      { handle }
    );
    return data.product;
  } catch {
    return null;
  }
}

export async function getProducts(options?: {
  first?: number;
  after?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<{ nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  try {
    const data = await shopifyFetch<{
      products: { nodes: Product[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
    }>(GET_PRODUCTS_QUERY, {
      first: options?.first ?? 24,
      after: options?.after ?? null,
      sortKey: options?.sortKey ?? null,
      reverse: options?.reverse ?? false,
    });
    return data.products;
  } catch {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  try {
    const data = await shopifyFetch<{ productRecommendations: Product[] }>(
      GET_PRODUCT_RECOMMENDATIONS_QUERY,
      { productId }
    );
    return data.productRecommendations;
  } catch {
    return [];
  }
}

// Collections

export async function getCollection(
  handle: string,
  options?: {
    first?: number;
    after?: string;
    sortKey?: string;
    reverse?: boolean;
  }
): Promise<Collection | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("collections", `collection:${handle}`);

  try {
    const data = await shopifyFetch<{ collection: Collection | null }>(
      GET_COLLECTION_QUERY,
      {
        handle,
        first: options?.first ?? 24,
        after: options?.after ?? null,
        sortKey: options?.sortKey ?? null,
        reverse: options?.reverse ?? false,
      }
    );
    return data.collection;
  } catch {
    return null;
  }
}

export async function getCollections(): Promise<
  { id: string; handle: string; title: string; description: string; image: { url: string; altText: string | null; width: number; height: number } | null }[]
> {
  "use cache";
  cacheLife("hours");
  cacheTag("collections");

  try {
    const data = await shopifyFetch<{
      collections: { nodes: { id: string; handle: string; title: string; description: string; image: { url: string; altText: string | null; width: number; height: number } | null }[] };
    }>(GET_COLLECTIONS_QUERY, { first: 20 });
    return data.collections.nodes;
  } catch {
    return [];
  }
}

// Cart

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(GET_CART_QUERY, {
    cartId,
  });
  return data.cart;
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: Cart };
  }>(CREATE_CART_MUTATION, { lines });
  return data.cartCreate.cart;
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: Cart };
  }>(ADD_CART_LINES_MUTATION, { cartId, lines });
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: Cart };
  }>(UPDATE_CART_LINES_MUTATION, { cartId, lines });
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: Cart };
  }>(REMOVE_CART_LINES_MUTATION, { cartId, lineIds });
  return data.cartLinesRemove.cart;
}

// Search

export async function searchProducts(
  query: string,
  options?: { first?: number; after?: string }
): Promise<SearchResult["products"]> {
  const data = await shopifyFetch<{
    search: { nodes: Product[]; pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor: string | null; endCursor: string | null } };
  }>(SEARCH_QUERY, {
    query,
    first: options?.first ?? 24,
    after: options?.after ?? null,
  });
  return { nodes: data.search.nodes, pageInfo: data.search.pageInfo };
}

export async function getPredictiveSearch(query: string) {
  const data = await shopifyFetch<{
    predictiveSearch: {
      products: { id: string; handle: string; title: string; featuredImage: { url: string; altText: string | null; width: number; height: number } | null; priceRange: { minVariantPrice: { amount: string; currencyCode: string } } }[];
      collections: { id: string; handle: string; title: string }[];
    };
  }>(PREDICTIVE_SEARCH_QUERY, { query });
  return data.predictiveSearch;
}
