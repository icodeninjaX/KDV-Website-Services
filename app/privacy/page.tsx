import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/site/FadeIn";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects inquiry and project information.`,
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "Information collected",
    body: [
      `${site.name} collects the information you send through the contact form, chat channels, booking tools, email, or project conversations. This can include your name, email address, company, service interest, budget range, project details, and any files or messages you choose to share.`,
      "The site may also receive basic technical information needed to operate securely, such as device, browser, page, timestamp, and server log data from hosting and form-processing providers.",
    ],
  },
  {
    title: "How the information is used",
    body: [
      "Information is used to respond to inquiries, schedule discovery calls, prepare proposals, deliver agreed project work, provide support, prevent spam or abuse, and keep required business records.",
      "KDV does not sell personal information. Information is shared only when needed to operate the site, deliver the service, comply with legal obligations, or use processors such as Vercel, Resend, Cal.com, and Tawk.to.",
    ],
  },
  {
    title: "Retention",
    body: [
      "Inquiry records are generally kept for up to 24 months so KDV can follow up, understand past conversations, and improve service quality. Project records may be kept longer when needed for active work, warranty support, tax, accounting, legal, or contractual reasons.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Under the Philippine Data Privacy Act of 2012, you may request access, correction, deletion or blocking, objection to processing, data portability where applicable, and information about how your data is handled.",
      "To make a privacy request, use the contact page. You may also contact the National Privacy Commission if you believe your rights have been violated.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="container-page pt-14 pb-10 sm:pt-20 sm:pb-12">
        <FadeIn mount>
          <div className="label-mono">Legal</div>
          <h1 className="mt-4 max-w-3xl font-display font-bold tracking-tight text-white text-balance text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Last updated: 2026-05-17. This page explains how KDV handles
            personal information from inquiries, calls, and project work.
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
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))}

          <FadeIn delay={0.18}>
            <div className="border-t border-white/[0.08] pt-6">
              <h2 className="font-display text-2xl font-bold text-white">
                Questions
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                For privacy questions or requests, use the contact page.
              </p>
              <Link href="/contact" className="mt-6 inline-flex">
                <Button>
                  Contact KDV <ArrowRight size={15} aria-hidden />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
