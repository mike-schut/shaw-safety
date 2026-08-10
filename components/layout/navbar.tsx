"use client";

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

  const itemCount = cart?.totalQuantity ?? 0;
  const cartTotal = cart?.cost.totalAmount
    ? formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)
    : "$0.00";

  return (
    <header className="sticky top-0 z-30">
      {/* Top bar */}
      <div className="bg-brand">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-white py-2 px-4">
          Free U.S. Shipping on Retail Orders
        </p>
      </div>

      {/* Main header */}
      <div className="border-b-2 border-brand bg-white">
        <div className="mx-auto flex max-w-[1800px] items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.PNG"
              alt="Shaw Safety"
              width={160}
              height={48}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/shop"
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
          </nav>

          {/* Search — grows to fill available space */}
          <div className="flex-1 hidden sm:block">
            <SearchInput />
          </div>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="ml-auto flex flex-shrink-0 items-center gap-2 text-gray-700 hover:text-brand transition-colors"
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
    </header>
  );
}
