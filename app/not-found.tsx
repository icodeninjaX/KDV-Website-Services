import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    href: "/",
    label: "Home",
    description: "Return to the main offer.",
    Icon: Home,
  },
  {
    href: "/portfolio",
    label: "Work",
    description: "Browse recent client projects.",
    Icon: BriefcaseBusiness,
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Start a project or book a call.",
    Icon: Mail,
  },
] as const;

export default function NotFound() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="max-w-3xl">
        <div className="label-mono">404</div>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          This page does not <span className="text-gradient">exist</span>.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
          The link may have moved. These paths are the fastest way back to the
          parts of the site most visitors need.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {routes.map(({ href, label, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-5 transition-colors hover:border-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-indigo-300">
              <Icon size={19} aria-hidden />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold text-white">
              {label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {description}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors group-hover:text-white">
              Go there <ArrowRight size={14} aria-hidden />
            </div>
          </Link>
        ))}
      </div>

      <Link href="/contact" className="mt-8 inline-flex">
        <Button>
          Start a project <ArrowRight size={15} aria-hidden />
        </Button>
      </Link>
    </section>
  );
}
