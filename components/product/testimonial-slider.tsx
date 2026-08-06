"use client";

import { useState, useCallback } from "react";

function ZipTieWatermark() {
  return (
    <svg
      viewBox="0 0 120 400"
      fill="currentColor"
      className="h-full w-auto"
      aria-hidden="true"
    >
      {/* Lock head */}
      <rect x="30" y="0" width="60" height="48" rx="6" />
      {/* Slot in head */}
      <rect x="44" y="10" width="16" height="28" rx="2" fill="#a11f2c" />
      {/* Strap body */}
      <rect x="50" y="48" width="20" height="320" rx="3" />
      {/* Teeth along left edge of strap */}
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x="43" y={60 + i * 13} width="7" height="7" rx="1" />
      ))}
      {/* Strap tip */}
      <polygon points="50,368 70,368 60,400" />
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    author: "John Smith",
    role: "Safety Manager, Acme Logistics",
  },
  {
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    author: "Sarah Johnson",
    role: "Operations Director, FastFreight Inc.",
  },
  {
    quote:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    author: "Mike Torres",
    role: "Warehouse Supervisor, Global Supply Co.",
  },
];

export function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setActive(next);
      setFading(false);
    }, 200);
  }, []);

  const prev = () => go((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => go((active + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[active];

  return (
    <section className="relative overflow-hidden bg-brand py-20">
      {/* Zip tie watermarks */}
      <div className="pointer-events-none absolute inset-y-0 left-8 flex items-center opacity-10 text-white">
        <div className="h-72">
          <ZipTieWatermark />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center opacity-10 text-white rotate-180">
        <div className="h-72">
          <ZipTieWatermark />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex-shrink-0 flex h-12 w-12 items-center justify-center text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Testimonial content */}
          <div
            className="flex-1 text-center text-white transition-opacity duration-200"
            style={{ opacity: fading ? 0 : 1 }}
          >
            {/* Large quote mark */}
            <div className="mb-4 text-[96px] leading-none font-serif text-white/60 select-none">
              &ldquo;
            </div>

            {/* Quote text */}
            <p className="mx-auto max-w-3xl text-xl font-bold leading-relaxed sm:text-2xl">
              {t.quote}
            </p>

            {/* Divider */}
            <div className="mx-auto mt-8 mb-6 h-px w-16 bg-white/40" />

            {/* Author */}
            <p className="text-sm font-semibold uppercase tracking-widest text-white/90">
              {t.author}
            </p>
            <p className="mt-1 text-sm text-white/60">{t.role}</p>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="flex-shrink-0 flex h-12 w-12 items-center justify-center text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-3">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
