"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ShopifyImage } from "@/lib/types";

export function ProductGallery({
  images,
  title,
  activeImageUrl,
}: {
  images: ShopifyImage[];
  title: string;
  activeImageUrl?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!activeImageUrl) return;
    const idx = images.findIndex((img) => img.url === activeImageUrl);
    if (idx !== -1) setActiveIndex(idx);
  }, [activeImageUrl, images]);

  const active = images[activeIndex];

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex space-x-4 bg-white p-12">
      <div className="relative flex-grow-1 flex-shrink-1 aspect-square overflow-hidden border-2 border-gray-200">
        <Image
          src={active.url}
          alt={active.altText ?? title}
          fill
          className="object-cover object-center"
          sizes="(min-width: 100%) 50vw, 100vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-col flex-grow-0 flex-shrink-0 gap-2 overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={image.url}
              onClick={() => setActiveIndex(i)}
              className={`relative h-32 w-32 flex-shrink-0 overflow-hidden border-2 transition-colors border-gray-200 ${
                i === activeIndex
                  ? "" // active
                  : ""
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? `${title} ${i + 1}`}
                fill
                className="object-cover object-center"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
