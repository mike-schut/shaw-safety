import "./marquee-strip.css";

const PHRASES = [
  "Meets Intermodal Container Security Requirements",
  "Direct Wholesale Pricing",
  "DOT Compliant Security Ties",
];

const SEPARATOR = (
  <span className="mx-8 h-3 w-3 flex-shrink-0 bg-brand" aria-hidden="true" />
);

function MarqueeContent() {
  return (
    <>
      {PHRASES.map((phrase, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="marquee-phrase text-6xl font-black uppercase tracking-tight">
            {phrase}
          </span>
          {SEPARATOR}
        </span>
      ))}
    </>
  );
}

export function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-gray-200 bg-white py-6">
      <div className="marquee-track flex">
        <div className="marquee-content flex" aria-hidden="false">
          <MarqueeContent />
        </div>
        <div className="marquee-content flex" aria-hidden="true">
          <MarqueeContent />
        </div>
      </div>
    </div>
  );
}
