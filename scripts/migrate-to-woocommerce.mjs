/**
 * One-time migration: products.json → WooCommerce
 *
 * Prerequisites:
 *   1. Add to .env.local (or export before running):
 *        WC_STORE_DOMAIN=shop.shawsafety.com
 *        WC_CONSUMER_KEY=ck_...
 *        WC_CONSUMER_SECRET=cs_...
 *
 *      Optionally, if your Next.js frontend is already deployed:
 *        FRONTEND_URL=https://shaw-safety.com
 *      This lets WooCommerce pull images directly from the frontend.
 *      If not set, images are skipped and must be added via WC admin.
 *
 *   2. Run:
 *        node -r dotenv/config scripts/migrate-to-woocommerce.mjs
 *      or, if dotenv isn't installed:
 *        WC_STORE_DOMAIN=... WC_CONSUMER_KEY=... WC_CONSUMER_SECRET=... node scripts/migrate-to-woocommerce.mjs
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Auto-load .env.local (Next.js loads this automatically; plain node does not)
const envFile = resolve(__dirname, "../.env.local");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}
const products = JSON.parse(
  readFileSync(resolve(__dirname, "../data/products.json"), "utf-8")
);

const WC_DOMAIN = process.env.WC_STORE_DOMAIN;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WC_DOMAIN || !WC_KEY || !WC_SECRET) {
  console.error("Missing env vars: WC_STORE_DOMAIN, WC_CONSUMER_KEY, WC_CONSUMER_SECRET");
  process.exit(1);
}

const BASE = `https://${WC_DOMAIN}/wp-json/wc/v3`;
const AUTH = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wcPost(path, body, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: AUTH },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${text}`);
      return JSON.parse(text);
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`    ↻ Attempt ${attempt} failed (${err.message}), retrying in 2s…`);
      await sleep(2000);
    }
  }
}

async function wcGet(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: { Authorization: AUTH } });
  const text = await res.text();
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${text}`);
  return JSON.parse(text);
}

for (const product of products) {
  console.log(`\n▶ Creating product: ${product.title}`);

  // Check if a product with this slug already exists
  const existing = await wcGet("/products", { slug: product.handle });
  if (existing.length > 0) {
    console.log(`  ⚠ Slug "${product.handle}" already exists (ID ${existing[0].id}), skipping.`);
    continue;
  }

  // Build attributes
  const attributes = product.options.map((opt, i) => ({
    name: opt.name,
    position: i,
    visible: true,
    variation: true,
    options: opt.values,
  }));

  // Create the variable product (images added via WooCommerce admin after migration)
  const created = await wcPost("/products", {
    name: product.title,
    slug: product.handle,
    type: "variable",
    status: "publish",
    description: product.descriptionHtml,
    short_description: "",
    catalog_visibility: "visible",
    tags: product.tags.map((t) => ({ name: t })),
    attributes,
  });

  console.log(`  ✓ Product created — ID: ${created.id}`);

  // Create each variation
  for (const variant of product.variants) {
    const varAttributes = variant.selectedOptions.map((opt) => ({
      name: opt.name,
      option: opt.value,
    }));

    const variationBody = {
      status: variant.availableForSale ? "publish" : "private",
      sku: variant.id,
      regular_price: variant.price.amount,
      stock_status: variant.availableForSale ? "instock" : "outofstock",
      manage_stock: false,
      attributes: varAttributes,
      // Tiered pricing stored as meta — read back by the Next.js frontend
      meta_data: [
        {
          key: "_tiered_pricing",
          value: JSON.stringify(variant.tieredPricing ?? []),
        },
      ],
    };

    const variation = await wcPost(`/products/${created.id}/variations`, variationBody);
    console.log(`    ✓ Variation: ${variant.title} (ID: ${variation.id})`);
    await sleep(500); // avoid overwhelming the server between requests
  }
}

console.log("\n✅ Migration complete.");
console.log(
  "\nNext step — add product images via WooCommerce admin:\n" +
  "  Products → edit each product → Product Gallery (add all images)\n" +
  "  Variations → edit each variation → set the variation image\n" +
  "  WooCommerce will serve images from its own media library."
);
