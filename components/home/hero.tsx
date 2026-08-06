import Link from "next/link";
import Image from "next/image";

type HeroProps = {
  eyebrow?: string;
  headline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
};

export function Hero({
  eyebrow = "Supplying Intermodal Hubs Nationwide",
  headline = "Industrial Zip Ties\nSecuring Fleets For Less",
  ctaLabel = "Shop Safety Ties",
  ctaHref = "/collections/all",
  imageSrc = "/images/shaw-security-image-001.jpg",
}: HeroProps) {
  return (
    <section className="w-full pt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px]">
        {/* Image container — 700px tall, , red bottom border */}
        <div className="relative h-[700px] overflow-hidden border-b-8 border-brand bg-gray-900">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Shaw Safety Security Ties"
              fill
              className="object-cover object-center"
              priority
              sizes="(min-width: 1800px) 1800px, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-start justify-center px-10 text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {headline.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className="inline-block border-2 border-transparent bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark"
              >
                {ctaLabel}
              </Link>
              <Link
                href="/collections/safety-vests"
                className="inline-block border-2 border-white px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                Shop Safety Vests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
