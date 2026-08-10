"use client";

import { useState, useCallback } from "react";

function ZipTieWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="90 808 1820 280"
      fill="none"
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path d="M153.902 833.58L277.405 833.577C284.454 833.577 291.241 836.158 296.508 840.838L334.331 874.461L334.331 1026.66L296.509 1060.28C291.241 1064.96 284.454 1067.54 277.405 1067.54L153.902 1067.54C138.014 1067.54 125.15 1054.68 125.153 1038.79L125.153 862.329C125.15 846.44 138.007 833.577 153.902 833.58ZM1663.96 879.329C1681.17 879.329 1698.36 881.421 1715.05 885.55L1837.56 915.834C1845.94 917.903 1851.79 925.378 1851.79 934.01L1851.79 967.106C1851.79 975.74 1845.94 983.212 1837.56 985.286L1715.05 1015.57C1698.36 1019.69 1681.17 1021.79 1663.96 1021.79L1556.82 1021.79L1556.82 879.329L1663.96 879.329ZM1539.15 879.329L1539.15 1021.79L1480.57 1021.79L1480.57 879.329L1539.15 879.329ZM1462.89 879.329L1462.89 1021.79L1404.31 1021.79L1404.31 879.329L1462.89 879.329ZM1386.64 879.329L1386.64 1021.79L1328.06 1021.79L1328.06 879.329L1386.64 879.329ZM1310.38 879.329L1310.38 1021.79L1251.81 1021.79L1251.81 879.329L1310.38 879.329ZM1234.13 879.329L1234.13 1021.79L1175.55 1021.79L1175.55 879.329L1234.13 879.329ZM1157.88 879.329L1157.88 1021.79L1099.3 1021.79L1099.3 879.329L1157.88 879.329ZM1081.62 879.329L1081.62 1021.79L1023.05 1021.79L1023.05 879.329L1081.62 879.329ZM1005.37 879.329L1005.37 1021.79L946.789 1021.79L946.789 879.329L1005.37 879.329ZM929.116 879.329L929.116 1021.79L870.538 1021.79L870.538 879.329L929.116 879.329ZM852.859 879.329L852.859 1021.79L794.28 1021.79L794.28 879.329L852.859 879.329ZM776.608 879.329L776.608 1021.79L718.029 1021.79L718.029 879.329L776.608 879.329ZM700.351 879.329L700.351 1021.79L641.772 1021.79L641.772 879.329L700.351 879.329ZM624.097 879.332L624.1 1021.79L565.521 1021.79L565.521 879.329L624.097 879.332ZM547.843 879.329L547.843 1021.79L489.264 1021.79L489.264 879.329L547.843 879.329ZM471.588 879.332L471.591 1021.79L352.006 1021.79L352.006 879.332L471.588 879.332ZM107.474 862.329L107.474 1038.79C107.474 1064.45 128.24 1085.21 153.902 1085.22L277.408 1085.22C288.788 1085.22 299.742 1081.05 308.25 1073.49L346.529 1039.46C490.704 1039.46 1529.21 1039.47 1663.96 1039.46C1682.59 1039.46 1701.21 1037.2 1719.29 1032.73L1841.8 1002.44C1858.09 998.417 1869.47 983.886 1869.47 967.107L1869.47 934.011C1869.47 917.177 1858.04 902.689 1841.8 898.674L1719.29 868.39C1701.21 863.921 1682.59 861.654 1663.97 861.654C1206.57 861.654 746.403 861.654 346.529 861.657L308.25 827.628C299.742 820.069 288.788 815.901 277.408 815.901L153.902 815.901C128.243 815.901 107.477 836.667 107.474 862.329Z" fill="currentColor" />
      <path d="M197.57 879.33L220.904 879.33L220.901 904.598C220.901 909.479 224.86 913.438 229.74 913.438C234.624 913.435 238.579 909.479 238.579 904.598L238.579 881.021C244.051 882.88 245.447 884.301 264.041 896.921C265.072 897.621 265.704 898.821 265.704 900.058L265.704 1001.06C265.704 1002.32 265.082 1003.49 264.041 1004.2C245.26 1016.96 243.466 1018.73 237.152 1020.55L237.152 996.525C237.152 994.082 236.161 991.873 234.561 990.273C229.047 984.758 219.476 988.63 219.476 996.522L219.479 1021.79L197.57 1021.79C195.48 1021.79 193.78 1020.09 193.777 1018L193.777 883.123C193.78 881.027 195.477 879.33 197.57 879.33ZM176.104 1018C176.104 1029.86 185.706 1039.47 197.57 1039.46C229.425 1039.47 228.281 1039.5 228.312 1039.47C228.54 1039.24 241.988 1040.54 256.208 1030.89L273.974 1018.82C279.861 1014.82 283.379 1008.18 283.376 1001.06L283.376 900.058C283.379 894.325 281.145 888.935 277.089 884.879C275.171 882.961 275.63 883.427 256.208 870.235C247.716 864.467 237.508 861.658 229.74 861.658C228.781 861.655 234.905 861.655 197.573 861.655C185.706 861.655 176.104 871.256 176.104 883.123L176.104 1018Z" fill="currentColor" />
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
    <div className="w-full px-4 py-16 sm:px-6 lg:px-8">
      <section className="relative mx-auto max-w-[1800px] overflow-hidden bg-brand py-20">
        {/* Zip tie watermarks */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center text-white opacity-10">
          <ZipTieWatermark className="h-16 w-auto sm:h-20" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center rotate-180 text-white opacity-10">
          <ZipTieWatermark className="h-16 w-auto sm:h-20" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}
