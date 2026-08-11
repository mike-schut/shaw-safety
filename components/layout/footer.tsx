import Link from "next/link";
import Image from "next/image";

const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Contact Us", href: "/contact" },
];

function MapPinIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#1A1F71"/>
      <text x="19" y="17" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#252525"/>
      <circle cx="15" cy="12" r="7" fill="#EB001B"/>
      <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
      <path d="M19 6.8a7 7 0 010 10.4A7 7 0 0119 6.8z" fill="#FF5F00"/>
    </svg>
  );
}

function AmexIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#2557D6"/>
      <text x="19" y="17" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.5">AMEX</text>
    </svg>
  );
}

function DiscoverIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
      <circle cx="27" cy="12" r="8" fill="#F76F20"/>
      <text x="8" y="16" fill="#231F20" fontSize="6.5" fontWeight="bold" fontFamily="Arial, sans-serif">DIS</text>
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
      <text x="7" y="16" fill="#009cde" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">Pay</text>
      <text x="20" y="16" fill="#012169" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">Pal</text>
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#000"/>
      <text x="19" y="16" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" letterSpacing="0.3"> Pay</text>
    </svg>
  );
}

function GooglePayIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
      <text x="5" y="16" fill="#4285F4" fontSize="7.5" fontWeight="bold" fontFamily="Arial, sans-serif">G</text>
      <text x="12" y="16" fill="#333" fontSize="7.5" fontFamily="Arial, sans-serif">Pay</text>
    </svg>
  );
}

const PAYMENT_ICONS = [
  { label: "Visa", icon: <VisaIcon /> },
  { label: "Mastercard", icon: <MastercardIcon /> },
  { label: "American Express", icon: <AmexIcon /> },
  { label: "Discover", icon: <DiscoverIcon /> },
  { label: "PayPal", icon: <PayPalIcon /> },
  { label: "Apple Pay", icon: <ApplePayIcon /> },
  { label: "Google Pay", icon: <GooglePayIcon /> },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300">
      {/* Main footer body */}
      <div className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8">

        {/* Top row: logo + contact info */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">

          {/* Logo */}
          <Link href="/" className="inline-block flex-shrink-0">
            <Image
              src="/logo.PNG"
              alt="Shaw Safety"
              width={140}
              height={42}
              className="h-auto w-[140px]"
            />
          </Link>

          {/* Contact items — spread horizontally */}
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-10 lg:flex-1 lg:justify-around">

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPinIcon />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-300">Shaw Safety</p>
                <p className="text-sm text-gray-300">Akron, OH 44305</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <PhoneIcon />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Phone</p>
                <a href="tel:3303668892" className="text-sm text-gray-300 hover:text-white transition-colors">
                  330-366-8892
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <EnvelopeIcon />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Email</p>
                <a href="mailto:sales@shawsafety.com" className="text-sm text-gray-300 hover:text-white transition-colors">
                  sales@shawsafety.com
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/10" />

        {/* Bottom row: support links + payment icons */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          {/* Support links */}
          <div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {POLICY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment methods */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Accepted Payments</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_ICONS.map(({ label, icon }) => (
                <div key={label} title={label} aria-label={label}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            &copy; 2026 Shaw Safety. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
