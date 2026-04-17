import { FadeIn } from "./FadeIn";

const faqs = [
  {
    q: "Why hire you over a Manila agency?",
    a: "Agencies bill for account managers, strategists, and overhead you don't need on an MSME-scale project. I'm the designer, developer, and your point of contact — fewer handoffs, faster shipping, and the savings stay with you.",
  },
  {
    q: "Do you accept GCash, Maya, or bank transfer?",
    a: "Yes — GCash, Maya, BPI, BDO, and Wise for clients abroad. Standard terms are 50% to start, 50% on launch. Receipts issued for each payment.",
  },
  {
    q: "I only have a rough idea and no copy — can we still start?",
    a: "Absolutely. Most clients come in with messy notes and a logo. I'll help shape the structure, draft sections you're stuck on, and polish what you write. Full copywriting (English or Taglish) is available as an add-on.",
  },
  {
    q: "Can my staff update the site after launch?",
    a: "Yes. You get a clean GitHub repo and a short Loom walking through how to change text, swap images, and add new sections. If you prefer a CMS (e.g. Sanity, Payload, WordPress), we can scope that in.",
  },
  {
    q: "What happens if something breaks after launch?",
    a: "Every project includes 30 days of post-launch support. After that I offer a flat monthly care plan, or you can call me per-incident — your choice. Hosting and infrastructure stay in your accounts, so you're never locked in.",
  },
];

export function HomeFAQ() {
  return (
    <section className="container-page py-24">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="label-mono">Common questions</div>
          <h2 className="mt-4 font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Answers before you ask.
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed">
            The things MSME owners usually want to know before reaching out. Don&rsquo;t see yours?
            Message me — I reply personally.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)]">
          <div className="divide-y divide-white/[0.06]">
            {faqs.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-7 py-5 text-white transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/70">
                  <span className="font-display text-[17px] font-semibold leading-snug">
                    {item.q}
                  </span>
                  <span
                    className="shrink-0 font-display text-2xl font-light text-white/30 transition-transform duration-200 group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="px-7 pb-6 pt-1">
                  <p className="max-w-3xl text-[15px] leading-relaxed text-white/60">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
