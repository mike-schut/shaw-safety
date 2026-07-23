"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const q = (form.elements.namedItem("q") as HTMLInputElement).value.trim();
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    },
    [router]
  );

  return (
    <form onSubmit={handleSearch} role="search">
      <div className="relative">
        <input
          type="search"
          name="q"
          defaultValue={defaultValue ?? searchParams.get("q") ?? ""}
          placeholder="Search products..."
          className="w-full border border-gray-300 bg-white py-2 pl-4 pr-12 text-base placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 bg-brand hover:bg-brand-dark transition-colors text-white"
          aria-label="Search"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
