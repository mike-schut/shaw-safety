import Image from "next/image";

const TRANSIT_DAYS = [
  { label: "1 Day",  color: "#2e7d32" },
  { label: "2 Days", color: "#66bb6a" },
  { label: "3 Days", color: "#fdd835" },
  { label: "4 Days", color: "#ef6c00" },
  { label: "5 Days", color: "#c62828" },
];

export function GroundDeliveryTimes() {
  return (
    <section className="mx-auto max-w-[1800px] px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Ground Delivery Times</h2>

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
        <div className="w-full lg:w-64 flex-shrink-0 border border-gray-200 bg-white p-6">
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
    </section>
  );
}
