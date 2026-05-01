import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import { SiWhatsapp, SiViber, SiMessenger } from "react-icons/si";
import { FadeIn } from "@/components/site/FadeIn";
import { ContactPanel } from "@/components/site/ContactPanel";
import { site } from "@/lib/site";

const channels = [
  {
    label: "WhatsApp",
    href: site.whatsapp,
    Icon: SiWhatsapp,
    hover: "hover:border-[#25D366]/60 hover:text-[#25D366]",
  },
  {
    label: "Viber",
    href: site.viber,
    Icon: SiViber,
    hover: "hover:border-[#7360F2]/60 hover:text-[#9b8cff]",
  },
  {
    label: "Messenger",
    href: site.messenger,
    Icon: SiMessenger,
    hover: "hover:border-[#0084FF]/60 hover:text-[#3aa0ff]",
  },
] as const;

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}. Typical reply ${site.responseWindow}.`,
};

export default function ContactPage() {
  return (
    <section className="container-page py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
        <FadeIn mount className="lg:col-span-2">
          <div className="label-mono">Start a project</div>
          <h1 className="mt-4 font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            Let&rsquo;s build{" "}
            <span className="text-gradient">something good</span>.
          </h1>
          <p className="mt-4 sm:mt-5 text-white/55 leading-relaxed text-[15px] text-justify">
            Tell me about your business, your goal, and where you&rsquo;re stuck. Every message
            gets a real reply from me, not a sales funnel.
          </p>

          <div className="mt-8 sm:mt-10">
            <div className="label-mono text-white/40">Chat with me</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {channels.map(({ label, href, Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat with Keith on ${label}`}
                  className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white/75 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${hover}`}
                >
                  <Icon size={16} aria-hidden />
                  <span>{label}</span>
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs text-white/35">
              Best on mobile. Desktop browsers may not have a handler installed.
            </p>
          </div>

          <dl className="mt-8 space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-indigo-400" aria-hidden />
              <div>
                <dt className="text-white/40">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-white/80 underline-offset-4 hover:underline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 rounded transition-colors"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={17} className="mt-0.5 shrink-0 text-indigo-400" aria-hidden />
              <div>
                <dt className="text-white/40">Typical reply</dt>
                <dd className="text-white/80">{site.responseWindow}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-indigo-400" aria-hidden />
              <div>
                <dt className="text-white/40">Based in</dt>
                <dd className="text-white/80">Philippines &middot; serving clients worldwide</dd>
              </div>
            </div>
          </dl>
        </FadeIn>

        <FadeIn mount delay={0.08} className="lg:col-span-3">
          <div className="border-spin-wrapper is-active">
            <div className="relative z-10 rounded-[15px] bg-[hsl(0_0%_6%)] p-5 sm:p-8">
              <ContactPanel />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
