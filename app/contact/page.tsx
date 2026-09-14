import type { Metadata } from "next";
import { Suspense } from "react";
import { SiWhatsapp, SiViber, SiMessenger } from "react-icons/si";
import { FadeIn } from "@/components/site/FadeIn";
import { ContactPanel } from "@/components/site/ContactPanel";
import { site } from "@/lib/site";

const channels = [
  { label: "WhatsApp", href: site.whatsapp, Icon: SiWhatsapp },
  { label: "Viber", href: site.viber, Icon: SiViber },
  { label: "Messenger", href: site.messenger, Icon: SiMessenger },
] as const;

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}. Typical reply ${site.responseWindow}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container-page py-10 sm:py-16">
      <FadeIn mount className="max-w-2xl">
        <div className="label-mono">Start a project</div>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Tell me what your business needs.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Share your goal and where you&rsquo;re stuck. Keith will reply {site.responseWindow}.
        </p>
      </FadeIn>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10">
        <FadeIn mount delay={0.08} className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-7">
          <Suspense fallback={<div className="h-96 rounded-xl bg-muted" />}>
            <ContactPanel />
          </Suspense>
        </FadeIn>
        <aside className="border-t border-border pt-6 lg:border-t-0 lg:pt-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Prefer to chat?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">You can also reach Keith on these channels.</p>
          <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {channels.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Chat with Keith on ${label}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Icon size={16} aria-hidden />{label}
              </a>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Chat links may open their respective apps.</p>
          <p className="mt-6 text-sm text-muted-foreground">Based in the Philippines.</p>
        </aside>
      </div>
    </section>
  );
}
