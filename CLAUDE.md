# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (run after changes to verify TypeScript + Next.js)
npm run lint     # ESLint
```

## Stack

- **Next.js 16** (App Router) — Breaking changes from prior versions; read `node_modules/next/dist/docs/` before writing code
- **React 19** — `use cache`, `useActionState`, and other new APIs in play
- **Tailwind CSS v4** — Config via CSS (`@import "tailwindcss"` in `globals.css`), no `tailwind.config.js`
- **Shopify Storefront API** (GraphQL, `@shopify/storefront-api-client`)
- **TypeScript**

## Architecture

### Next.js 16 Specifics

- **Caching**: `cacheComponents: true` is set in `next.config.ts`. Use `'use cache'` directive + `cacheLife()` + `cacheTag()` from `next/cache` to cache data-fetching functions. Do NOT use old `fetch({ cache: 'force-cache' })` or `unstable_cache`.
- **`cookies()` and `headers()` are async**: always `await cookies()` and `await headers()`.
- **`params` / `searchParams` in pages are Promises**: always `await params` before destructuring.
- **`searchParams` is runtime data**: never access `await searchParams` directly in a page component — put it inside an inner async component that is itself wrapped in `<Suspense>`. See `app/collections/[handle]/page.tsx` → `CollectionProducts` pattern.
- **`new Date()` is forbidden in Server Components** without first accessing runtime or cached data. Hardcode the year in static UI elements.
- **`revalidateTag(tag, profile)`** requires two arguments in Next.js 16 (the second is a cache life profile string like `'hours'`). For immediate invalidation in Server Actions, use `updateTag(tag)` instead.
- **Root layout must not access runtime APIs**: `cookies()`, `headers()`, etc. in the root layout cause build errors. Use client-side initialization instead (see `CartInitializer`).

### Shopify Layer (`lib/shopify/`)

- `lib/shopify/index.ts` — Storefront API client init (`createStorefrontApiClient`) and all data-fetching functions. Read/collection functions use `'use cache'` + `cacheLife('hours')` + `cacheTag`. Cart functions are uncached (always fresh).
- `lib/shopify/types.ts` — TypeScript types for all Shopify entities (Product, Cart, CartLine, etc.)
- `lib/shopify/queries/` — Raw GraphQL strings split by domain (product, collection, cart, search). Shared fragments in `fragments.ts`.
- API version: `2025-01`

### Cart Architecture

- Cart ID stored in an httpOnly cookie (`shopify_cart_id`) — set/read via `app/actions/cart.ts` Server Actions.
- `CartProvider` (`context/cart-context.tsx`) wraps the whole app in `app/layout.tsx`. It holds the `Cart` object and `isOpen` state for the slide-out drawer.
- `app/layout.tsx` fetches the cart server-side on every page load (`fetchCart()`) and passes it to `CartProvider` as `initialCart`.
- Cart mutations (`addToCart`, `updateCartItem`, `removeFromCart`) are in `app/actions/cart.ts`. After mutating, they call `revalidateTag('cart')` and return the updated `Cart`.
- Client components (`CartItem`, `AddToCart`) call Server Actions and update context with `setCart(updated)`.

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Fetches collections + 8 featured products |
| `/collections/[handle]` | `app/collections/[handle]/page.tsx` | `handle="all"` calls `getProducts`, others call `getCollection`. Sort via `?sort=` searchParam |
| `/products/[handle]` | `app/products/[handle]/page.tsx` | PDP with gallery, variant selector, recommendations |
| `/cart` | `app/cart/page.tsx` + `cart-page-client.tsx` | Server fetches cart, client renders with live context |
| `/search` | `app/search/page.tsx` | `?q=` param drives `searchProducts()` |

### Components

- `components/cart/add-to-cart.tsx` — Client component; holds selected variant options in state, calls `addToCart` Server Action, opens drawer via `useCart()`.
- `components/cart/cart-drawer.tsx` — Slide-out panel, reads `isOpen` from `useCart()`.
- `components/collection/sort-selector.tsx` — Client component; updates `?sort=` URL param.
- `components/search/search-input.tsx` — Client component; submits to `/search?q=`.

## Environment Variables

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

Get the Storefront access token: Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app → Storefront API access → Install and copy the token.
