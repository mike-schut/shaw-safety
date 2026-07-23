import Image from "next/image";
import Link from "next/link";
import { ZipTieIcon } from "@/components/ui/ziptie-icon";

type Props = {
  headline?: string;
  subheadline?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
};

export function CenteredPromo({
  headline = "Custom Safety Seals",
  subheadline = "Seals Ship within 24 hours, Not Weeks!",
  description = "Same Compliance <span style='color:#5d615e;font-size:2rem;display:inline-block;line-height:1;transform:translateY(0.2rem)'>•</span> Same Visibility <span style='color:#5d615e;font-size:2rem;display:inline-block;line-height:1;transform:translateY(0.2rem)'>•</span> Lower Price",
  ctaLabel = "Browse All Products",
  ctaHref = "/collections/all",
  imageSrc = "/images/shaw-security-image-003.png",
}: Props) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1800px] px-4 text-center sm:px-6 lg:px-8">
        <ZipTieIcon className="mx-auto mb-4 h-4 w-auto text-brand" />
        <h2 className="text-4xl font-bold text-gray-900 sm:text-7xl leading-[1.5]">
          {headline}<br/>
          <span className="text-brand">{subheadline}</span>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-[#191d1c]" dangerouslySetInnerHTML={{ __html: description }} />
        <Link
          href={ctaHref}
          className="mt-8 inline-block bg-brand px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {ctaLabel}
        </Link>
      </div>

      <div className="mt-12 relative mx-auto aspect-[16/7] max-w-[1024px] w-full overflow-hidden ">
        <Image
          src={imageSrc}
          alt="Shaw Safety product lineup"
          fill
          className="object-cover object-center"
          sizes="(min-width: 896px) 896px, 100vw"
        />
      </div>
    </section>
  );
}
