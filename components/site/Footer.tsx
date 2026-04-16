import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-black/30">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 text-white">
            <Logo height={48} />
            <span className="text-sm font-medium text-white/60">Website Services</span>
          </div>
          <p className="mt-5 max-w-md text-sm text-white/60">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-sm text-gradient hover:underline"
          >
            {site.email}
          </a>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/portfolio" className="hover:text-white">
                Work
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Crafted with care.
          </p>
          <p>Built on Next.js &middot; Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
