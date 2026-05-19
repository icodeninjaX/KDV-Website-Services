import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Project terms, payment expectations, ownership, and support terms for ${site.name}.`,
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  {
    title: "Scope and proposals",
    body: [
      "Each project starts with a conversation and a written scope or proposal. The proposal defines the deliverables, timeline, payment schedule, revision expectations, third-party services, and any assumptions needed to price the work.",
      "Work outside the agreed scope may require a separate quote, change request, or follow-up phase.",
    ],
  },
  {
    title: "Payments",
    body: [
      "Standard project terms are 50% to start and 50% before launch or handoff, unless a written proposal says otherwise. Accepted payment channels include GCash, Maya, BPI, BDO, and Wise for international clients.",
      "Late payments may delay delivery, launch, support, or transfer of project assets until the account is current.",
    ],
  },
  {
    title: "Client responsibilities",
    body: [
      "Clients are responsible for providing accurate business information, approved content, timely feedback, access to required accounts, and permission to use any supplied logos, images, copy, data, or brand assets.",
      "KDV is not responsible for delays caused by missing approvals, unavailable account access, incomplete content, or third-party service outages outside KDV control.",
    ],
  },
  {
    title: "Ownership and handoff",
    body: [
      "After full payment, the client owns the final custom deliverables created for the project, except for third-party tools, open-source packages, licensed assets, platform code, and pre-existing KDV materials.",
      "Project repositories, hosting, domains, analytics, payment processors, and other infrastructure should live in the client's own accounts unless a written agreement says otherwise.",
    ],
  },
  {
    title: "Support and limitations",
    body: [
      "Projects include the support period stated in the proposal. Support covers fixes for agreed deliverables, not new features, unrelated platform changes, third-party outages, content rewrites, or business losses.",
      "To the fullest extent allowed by Philippine law, KDV is not liable for indirect, incidental, consequential, or lost-profit damages arising from use of the site, project, or related services.",
    ],
  },
  {
    title: "Governing law",
    body: [
      "These terms are governed by the laws of the Republic of the Philippines. Any dispute should first be handled in good faith through direct communication before either party takes formal action.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">Legal</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55">
            Last updated: 2026-05-17. These terms outline how KDV scopes,
            delivers, and hands off website, dashboard, and web app work.
          </p>
        </FadeIn>
      </section>

      <section className="container-page pb-16 sm:pb-20">
        <div className="max-w-3xl space-y-10">
          {sections.map((section, index) => (
            <FadeIn key={section.title} delay={index * 0.04}>
              <section className="border-t border-white/[0.08] pt-6">
                <h2 className="font-display text-2xl font-bold text-white">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-white/60">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))}

          <FadeIn delay={0.22}>
            <div className="border-t border-white/[0.08] pt-6">
              <h2 className="font-display text-2xl font-bold text-white">
                Questions
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                For questions about a project scope or agreement, email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="rounded text-white underline-offset-4 transition-colors hover:text-indigo-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                >
                  {site.email}
                </a>
                .
              </p>
              <Link href="/contact" className="mt-6 inline-flex">
                <Button>
                  Start a project <ArrowRight size={15} aria-hidden />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
