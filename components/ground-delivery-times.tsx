import Image from "next/image";
import { ZipTieIcon } from "@/components/ui/ziptie-icon";

const TRANSIT_DAYS = [
  { label: "1 Day",  color: "#fcd2d2" },
  { label: "2 Days", color: "#fbb1b4" },
  { label: "3 Days", color: "#dd5863" },
  { label: "4 Days", color: "#bd1124" },
  { label: "5 Days", color: "#8e0511" },
  { label: "6 Days", color: "#680001" },
];

export function GroundDeliveryTimes() {
  return (
    <section className="mx-auto max-w-[1800px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <ZipTieIcon className="mx-auto mb-4 h-4 w-auto text-brand" />
        <h2 className="text-4xl font-bold text-gray-900">Ground Delivery Times</h2>
        <p className="mt-4 text-lg leading-relaxed text-[#191d1c]">
          Shipping Location: Akron, OH - 44305
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Map */}
        <div className="flex-1 min-w-0">
          <div className="relative w-full" style={{ aspectRatio: "1600/900" }}>
            <Image
              src="/images/Shaw-Safety-Shipping-Map.png"
              alt="Shaw Safety ground shipping delivery times map"
              fill
              className="object-contain object-left"
              sizes="(min-width: 1024px) 75vw, 100vw"
            />
          </div>
        </div>

        {/* Key box */}
        <div className="w-full lg:w-64 flex-shrink-0">
          {/* American flag */}
          <div className="mb-3">
            <svg viewBox="0 0 190 100" xmlns="http://www.w3.org/2000/svg" className="w-40 h-auto">
              {/* Red background */}
              <rect width="190" height="100" fill="#B22234"/>
              {/* White stripes */}
              <rect y="7.7" width="190" height="7.7" fill="white"/>
              <rect y="23.1" width="190" height="7.7" fill="white"/>
              <rect y="38.5" width="190" height="7.7" fill="white"/>
              <rect y="53.8" width="190" height="7.7" fill="white"/>
              <rect y="69.2" width="190" height="7.7" fill="white"/>
              <rect y="84.6" width="190" height="7.7" fill="white"/>
              {/* Blue canton */}
              <rect width="76" height="53.8" fill="#3C3B6E"/>
              {/* Stars — 9 rows, alternating 6 and 5 (50 total) */}
              {/* Row 1 — 6 stars */}
              <circle cx="6.3" cy="3" r="1.8" fill="white"/><circle cx="19" cy="3" r="1.8" fill="white"/><circle cx="31.7" cy="3" r="1.8" fill="white"/><circle cx="44.3" cy="3" r="1.8" fill="white"/><circle cx="57" cy="3" r="1.8" fill="white"/><circle cx="69.7" cy="3" r="1.8" fill="white"/>
              {/* Row 2 — 5 stars */}
              <circle cx="12.7" cy="9" r="1.8" fill="white"/><circle cx="25.3" cy="9" r="1.8" fill="white"/><circle cx="38" cy="9" r="1.8" fill="white"/><circle cx="50.7" cy="9" r="1.8" fill="white"/><circle cx="63.3" cy="9" r="1.8" fill="white"/>
              {/* Row 3 — 6 stars */}
              <circle cx="6.3" cy="15" r="1.8" fill="white"/><circle cx="19" cy="15" r="1.8" fill="white"/><circle cx="31.7" cy="15" r="1.8" fill="white"/><circle cx="44.3" cy="15" r="1.8" fill="white"/><circle cx="57" cy="15" r="1.8" fill="white"/><circle cx="69.7" cy="15" r="1.8" fill="white"/>
              {/* Row 4 — 5 stars */}
              <circle cx="12.7" cy="21" r="1.8" fill="white"/><circle cx="25.3" cy="21" r="1.8" fill="white"/><circle cx="38" cy="21" r="1.8" fill="white"/><circle cx="50.7" cy="21" r="1.8" fill="white"/><circle cx="63.3" cy="21" r="1.8" fill="white"/>
              {/* Row 5 — 6 stars */}
              <circle cx="6.3" cy="27" r="1.8" fill="white"/><circle cx="19" cy="27" r="1.8" fill="white"/><circle cx="31.7" cy="27" r="1.8" fill="white"/><circle cx="44.3" cy="27" r="1.8" fill="white"/><circle cx="57" cy="27" r="1.8" fill="white"/><circle cx="69.7" cy="27" r="1.8" fill="white"/>
              {/* Row 6 — 5 stars */}
              <circle cx="12.7" cy="33" r="1.8" fill="white"/><circle cx="25.3" cy="33" r="1.8" fill="white"/><circle cx="38" cy="33" r="1.8" fill="white"/><circle cx="50.7" cy="33" r="1.8" fill="white"/><circle cx="63.3" cy="33" r="1.8" fill="white"/>
              {/* Row 7 — 6 stars */}
              <circle cx="6.3" cy="39" r="1.8" fill="white"/><circle cx="19" cy="39" r="1.8" fill="white"/><circle cx="31.7" cy="39" r="1.8" fill="white"/><circle cx="44.3" cy="39" r="1.8" fill="white"/><circle cx="57" cy="39" r="1.8" fill="white"/><circle cx="69.7" cy="39" r="1.8" fill="white"/>
              {/* Row 8 — 5 stars */}
              <circle cx="12.7" cy="45" r="1.8" fill="white"/><circle cx="25.3" cy="45" r="1.8" fill="white"/><circle cx="38" cy="45" r="1.8" fill="white"/><circle cx="50.7" cy="45" r="1.8" fill="white"/><circle cx="63.3" cy="45" r="1.8" fill="white"/>
              {/* Row 9 — 6 stars */}
              <circle cx="6.3" cy="51" r="1.8" fill="white"/><circle cx="19" cy="51" r="1.8" fill="white"/><circle cx="31.7" cy="51" r="1.8" fill="white"/><circle cx="44.3" cy="51" r="1.8" fill="white"/><circle cx="57" cy="51" r="1.8" fill="white"/><circle cx="69.7" cy="51" r="1.8" fill="white"/>
            </svg>
          </div>

        <div className="border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-gray-900">Transit Days</h3>
          <p className="mt-0.5 text-sm text-gray-500">(Business Days)</p>

          <ul className="mt-5 space-y-3">
            {TRANSIT_DAYS.map(({ label, color }) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className="h-5 w-8 flex-shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            Expedited shipping methods available at checkout
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
