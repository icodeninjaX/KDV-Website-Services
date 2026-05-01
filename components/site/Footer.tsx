import Link from "next/link";
import { SiWhatsapp, SiViber, SiMessenger } from "react-icons/si";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "./Logo";

const footerChannels = [
  { label: "WhatsApp", href: site.whatsapp, Icon: SiWhatsapp },
  { label: "Viber", href: site.viber, Icon: SiViber },
  { label: "Messenger", href: site.messenger, Icon: SiMessenger },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.07]">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo height={36} />
            <span className="text-sm font-medium text-white/40">Website Services</span>
          </div>
          <p className="mt-5 max-w-sm text-sm text-white/40 leading-relaxed text-justify">
            {site.tagline}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
          >
            {site.email}
          </a>
          <div className="mt-4 flex items-center gap-2">
            {footerChannels.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with Keith on ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/55 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              >
                <Icon size={15} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white/30">Services</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/50">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white/30">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/50">
            {[
              { href: "/portfolio", label: "Work" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/25 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Crafted with care.
          </p>
          <p>Built on Next.js &middot; Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
