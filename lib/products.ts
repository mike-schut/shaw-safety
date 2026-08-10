// Data layer — delegates to WooCommerce REST API.
// Swap this file's exports to switch data sources; all pages stay untouched.
export {
  getProduct,
  getProducts,
  getCollection,
  getCollections,
  getProductRecommendations,
  searchProducts,
} from "@/lib/woocommerce";
