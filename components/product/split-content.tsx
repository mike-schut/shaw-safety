import Image from "next/image";

export function SplitContent() {
  return (
    <section className="mx-auto max-w-[1800px]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image panel */}
        <div className="relative min-h-[400px]">
          <Image
            src="/images/products/zip-tie-detail-1.webp"
            alt="Shaw Safety zip ties in use"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        {/* Content panel */}
        <div className="flex flex-col justify-center bg-gray-50 px-8 py-16 sm:px-12 lg:px-16">
          <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand">
            Why Shaw Safety
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Built for the demands of industrial use
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-block bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              Shop All Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
