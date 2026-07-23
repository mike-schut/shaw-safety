import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="text-sm font-semibold">
            Shaw Safety
          </Link>
          <p className="text-xs text-gray-500">
            &copy; 2025 Shaw Safety. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
