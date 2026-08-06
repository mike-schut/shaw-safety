function CheckCircleIcon() {
  return (
    <svg className="h-12 w-12 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const ITEMS = [
  { text: "Meets intermodal container security requirements", uppercase: true },
  { text: "Direct Wholesale Pricing", uppercase: false },
];

export function TrustBanner() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="bg-[#f4f5f3] px-8 py-5">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-16">
            {ITEMS.map(({ text, uppercase }) => (
              <div key={text} className="flex items-center gap-3 text-[#191d1c]">
                <CheckCircleIcon />
                <span
                  className={
                    uppercase
                      ? "text-xl font-extrabold uppercase tracking-wide sm:text-2xl"
                      : "text-lg font-medium sm:text-xl"
                  }
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
