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
            <span className="text-sm font-medium text-muted-foreground">Website Services</span>
          </div>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground leading-relaxed text-left">
            {site.tagline}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {footerChannels.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with Keith on ${label}`}
                className="flex min-h-11 items-center justify-center gap-2 px-3 rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              >
                <Icon size={15} aria-hidden />{label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {[
              { href: "/portfolio", label: "Work" },
              { href: "/estimate", label: "Estimate" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Crafted with care.
          </p>

        </div>
      </div>
    </footer>
  );
}
