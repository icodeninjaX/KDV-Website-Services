import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}. Typical reply ${site.responseWindow}.`,
};

export default function ContactPage() {
  return (
    <section className="container-page py-20">
      <div className="grid gap-12 lg:grid-cols-5">
        <FadeIn mount className="lg:col-span-2">
          <div className="label-mono">Start a project</div>
          <h1 className="mt-4 font-display font-bold tracking-tight text-white text-balance text-5xl sm:text-6xl leading-tight">
            Let&rsquo;s build{" "}
            <span className="text-gradient">something good</span>.
          </h1>
          <p className="mt-5 text-white/55 leading-relaxed text-[15px]">
            Tell me about your business, your goal, and where you&rsquo;re stuck. Every message
            gets a real reply from me — not a sales funnel.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
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
          <div className="rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-7 sm:p-8">
            <ContactForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
