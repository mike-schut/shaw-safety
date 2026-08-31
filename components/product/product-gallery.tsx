"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/types";

export function ProductGallery({
  images,
  title,
  resetKey,
}: {
  images: ShopifyImage[];
  title: string;
  /** Changes whenever the selected variant changes (its id, not its image
   *  URL — two variants could coincidentally share the same hero image,
   *  which would silently skip this reset if keyed on the URL instead). */
  resetKey?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first image (the variant's hero) whenever the variant changes.
  // The parent guarantees images[0] is always the selected variant's image.
  useEffect(() => {
    setActiveIndex(0);
  }, [resetKey]);

  const active = images[activeIndex];

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-4 sm:p-8 lg:flex-row lg:items-start lg:gap-4 lg:p-12">
      <div className="relative w-full aspect-square overflow-hidden border-2 border-gray-200">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-row gap-2 overflow-x-auto lg:flex-shrink-0 lg:flex-col lg:overflow-x-visible">
          {images.map((image, i) => (
            <button
              key={image.url}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeIndex}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-colors sm:h-24 sm:w-24 lg:h-32 lg:w-32 ${
                i === activeIndex ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${title} ${i + 1}`}
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 128px, (min-width: 640px) 96px, 80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
