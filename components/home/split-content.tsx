import Image from "next/image";
import Link from "next/link";
import { ZipTieIcon } from "@/components/ui/ziptie-icon";

type Props = {
  headline?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  calloutDescription?: string;
  calloutLinkLabel?: string;
  calloutLinkHref?: string;
  imageSrc?: string;
};

export function SplitContent({
  headline = "Let Us Match You to Your Perfect Ziptie",
  description = "Let our experts provide free assistance to save you time and money, or take a quick quiz and find out on the spot.",
  ctaLabel = "Get in Touch with Us",
  ctaHref = "/shop",
  calloutDescription = "Need help finding the right product for your application? Our team is standing by.",
  calloutLinkLabel = "+1 (000)-000-0000",
  calloutLinkHref = "tel:+10000000000",
  imageSrc,
}: Props) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left — image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 shadow-md">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Shaw Safety"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-gray-400">
                  Section image — replace with actual image
                </span>
              </div>
            )}
          </div>

          {/* Right — content */}
          <div className="space-y-6">
            <ZipTieIcon className="h-4 w-auto text-brand" />
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {headline}
            </h2>
            <p className="text-base leading-relaxed text-gray-600">
              {description}
            </p>
            <Link
              href={ctaHref}
              className="inline-block bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              {ctaLabel}
            </Link>

            {/* Callout box */}
            <div className="bg-[#f4f5f3] p-6">
              <p className="text-base leading-relaxed text-gray-600">
                {calloutDescription}
              </p>
              <Link
                href={calloutLinkHref}
                className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-gray-600 underline hover:text-gray-800"
              >
                <svg className="h-7 w-7 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.483.314-.924.786-1.046l4.5-1.125a1.125 1.125 0 011.11.32l1.875 2.25a1.125 1.125 0 01-.054 1.515L8.72 9.998a11.215 11.215 0 005.28 5.28l1.746-1.747a1.125 1.125 0 011.515-.054l2.25 1.875a1.125 1.125 0 01.32 1.11l-1.125 4.5a1.125 1.125 0 01-1.046.786C8.717 21.75 2.25 15.283 2.25 6.338z" />
                </svg>
                {calloutLinkLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
