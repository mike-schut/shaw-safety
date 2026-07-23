import type { Metadata } from "next";
import Link from "next/link";
import { CartPageClient } from "./cart-page-client";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Your Cart</h1>
      <CartPageClient />
      <div className="mt-6">
        <Link
          href="/collections/all"
          className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
        >
          &larr; Continue shopping
        </Link>
      </div>
    </div>
  );
}
