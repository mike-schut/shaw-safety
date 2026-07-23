import Image from "next/image";
import { ZipTieIcon } from "@/components/ui/ziptie-icon";

function ShieldIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function CertIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function ContainerIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function RecycleIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

const BULLETS = [
  {
    icon: <ShieldIcon />,
    headline: "100-Count Bags",
    description:
      "Easy to distribute to every driver.",
  },
  {
    icon: <TruckIcon />,
    headline: "Bulk Pricing Available",
    description:
      "Save more on every order.",
  },
  {
    icon: <CertIcon />,
    headline: "Fast Shipping",
    description:
      "Keep your operation moving.",
  },
];

const CALLOUTS = [
  {
    icon: <BoltIcon />,
    headline: "High Visibility Yellow",
    description: "Easy for drivers and inspectors to see.",
  },
  {
    icon: <DropletIcon />,
    headline: '4-11" Long',
    description: "Designed for intermodal container locking mechanisms.",
  },
  {
    icon: <ContainerIcon />,
    headline: "75LB Strength",
    description: "Strong enough for daily transport operations.",
  },
  {
    icon: <RecycleIcon />,
    headline: "only <span class='text-2xl'>$2.19</span>/bag",
    description: "100 ties per bag",
  },
];

type Props = {
  imageSrc?: string;
};

export function FeatureSplit({ imageSrc = "/images/shaw-security-image-002.webp" }: Props) {
  return (
    <section className="relative bg-[#f4f5f3] py-20 overflow-hidden">

      {/* Decorative background zip tie accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div style={{ position: "absolute", top: "8%", right: "-4%", transform: "rotate(-22deg)", opacity: 0.18 }}>
          <ZipTieIcon className="h-20 w-auto text-gray-500" />
        </div>
        <div style={{ position: "absolute", bottom: "12%", left: "-2%", transform: "rotate(14deg)", opacity: 0.14 }}>
          <ZipTieIcon className="h-14 w-auto text-gray-500" />
        </div>
        <div style={{ position: "absolute", top: "52%", right: "18%", transform: "rotate(-8deg)", opacity: 0.1 }}>
          <ZipTieIcon className="h-10 w-auto text-gray-500" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-stretch">

          {/* Left — text + bullets */}
          <div className="flex flex-col justify-center">
            <ZipTieIcon className="mb-4 h-4 w-auto text-brand" />
            <h2 className="text-3xl font-bold uppercase text-[#191d1c] sm:text-4xl">
              High Visibility. High Strength.{" "}
              <span className="text-brand">Great Price.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Our Yellow Zip Ties get the job done right, but for less.
            </p>

            <ul className="mt-10 space-y-7">
              {BULLETS.map((bullet) => (
                <li key={bullet.headline} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-brand text-white shadow-sm">
                    {bullet.icon}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-wide text-[#191d1c]">{bullet.headline}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {bullet.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — image + callouts side by side */}
          <div className="flex gap-4 min-h-[480px]">

            {/* Image — full height */}
            <div className="relative flex-1 overflow-hidden bg-gray-200">
              <Image
                src={imageSrc}
                alt="Shaw Safety security zip ties"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </div>

            {/* Callouts list */}
            <ul className="flex w-[45%] flex-col justify-between gap-3">
              {CALLOUTS.map((callout, i) => (
                <li
                  key={callout.headline}
                  className={`flex flex-1 items-center gap-3 p-3 ${
                    i === CALLOUTS.length - 1
                      ? "border border-brand"
                      : ""
                  }`}
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-[#f8e53c] text-[#191d1c]">
                    {callout.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#191d1c]" dangerouslySetInnerHTML={{ __html: callout.headline }}>
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: callout.description }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
