"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { SearchInput } from "@/components/search/search-input";
import { formatPrice } from "@/lib/utils";

function CartIcon() {
  return (
    <svg className="h-7 w-7 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

export function Navbar() {
  const { cart, openCart } = useCart();

  // Defer cart-derived UI until after hydration — localStorage isn't available
  // on the server so the first server render always has an empty cart. Rendering
  // the badge or a non-zero total on the client before effects fire causes a
  // hydration mismatch in Next.js 16's PPR/Suspense model.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const itemCount = mounted ? (cart?.totalQuantity ?? 0) : 0;
  const cartTotal = mounted && cart?.cost.totalAmount
    ? formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)
    : "$0.00";

  return (
    <header className="sticky top-0 z-30">
      {/* Top bar */}
      <div className="bg-brand">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-white py-2 px-4">
          Order by 6pm for same day shipping
        </p>
      </div>

      {/* Main header */}
      <div className="border-b-2 border-brand bg-white">
        <div className="mx-auto flex max-w-[1800px] items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo + phone */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <Link href="/">
              <Image
                src="/logo.PNG"
                alt="Shaw Safety"
                width={160}
                height={48}
                priority
                className="h-auto w-[160px] sm:w-auto sm:h-10 object-contain"
              />
            </Link>
            <a
              href="tel:3303668892"
              className="hidden sm:block text-lg font-semibold text-gray-700 hover:text-brand transition-colors whitespace-nowrap"
            >
              330-366-8892
            </a>
          </div>

          {/* Nav links */}
          {/* <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products/high-visibility-zip-ties"
              className="text-base font-semibold text-gray-700 hover:text-brand transition-colors whitespace-nowrap"
            >
              Shop Safety Ties
            </Link>
            <Link
              href="/collections/safety-vests"
              className="text-base font-semibold text-gray-700 hover:text-brand transition-colors whitespace-nowrap"
            >
              Shop Safety Vests
            </Link>
          </nav> */}

          {/* Search — grows to fill available space */}
          {/* <div className="flex-1 hidden sm:block">
            <SearchInput />
          </div> */}

          {/* Order History + Cart */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-6">
            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1.5 text-base font-semibold text-gray-700 hover:text-brand transition-colors whitespace-nowrap"
            >
              <svg className="h-7 w-7 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Order History
            </Link>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="flex flex-shrink-0 items-center gap-2 text-gray-700 hover:text-brand transition-colors"
            aria-label="Open cart"
          >
            <div className="relative">
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-brand text-[10px] font-bold text-white leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </div>
            <span className="text-base font-semibold">Cart</span>
            <span className="text-base font-bold">{cartTotal}</span>
          </button>
          </div>
        </div>
      </div>
    </header>
  );
}
