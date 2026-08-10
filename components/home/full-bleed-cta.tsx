import Image from "next/image";
import Link from "next/link";

type Props = {
  headline?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
};

export function FullBleedCta({
  headline = "Lorem ipsum <span class='text-brand font-black'>dolor sit amet</span>",
  description = "Lorem ipsum dolor sit amet, consectetur incididunt ut <span class='font-bold'>labore et dolore magna aliqua!</span>",
  ctaLabel = "Shop Safety Ties",
  ctaHref = "/shop",
  imageSrc = "/images/shaw-security-image-005.jpg",
}: Props) {
  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="relative overflow-hidden bg-gray-900 py-32">
          {/* Background image */}
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(min-width: 1800px) 1800px, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Content */}
          <div className="relative z-10 mx-auto px-6 text-center">
            <h2 className="text-5xl font-semibold text-white sm:text-5xl lg:text-6xl" dangerouslySetInnerHTML={{ __html: headline }}></h2>
            <p className="mt-5 text-lg leading-relaxed text-white" dangerouslySetInnerHTML={{ __html: description }}></p>
            <Link
              href={ctaHref}
              className="mt-10 inline-block bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
