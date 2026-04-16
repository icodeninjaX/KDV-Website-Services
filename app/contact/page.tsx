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
        <FadeIn className="lg:col-span-2">
          <div className="text-sm font-medium text-gradient">Start a project</div>
          <h1 className="mt-3 text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Let's build <span className="text-gradient">something good</span>.
          </h1>
          <p className="mt-4 text-white/70">
            Tell me about your business, your goal, and where you're stuck. Every message gets a
            real reply from me — not a sales funnel.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-violet-400" />
              <div>
                <dt className="text-white/50">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-gradient hover:underline"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 text-violet-400" />
              <div>
                <dt className="text-white/50">Typical reply</dt>
                <dd className="text-white">{site.responseWindow}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-violet-400" />
              <div>
                <dt className="text-white/50">Based in</dt>
                <dd className="text-white">Remote &middot; serving clients worldwide</dd>
              </div>
            </div>
          </dl>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <ContactForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
