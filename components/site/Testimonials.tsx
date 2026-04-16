import { FadeIn } from "./FadeIn";

const quotes = [
  {
    body: "Keith took a vague idea and turned it into a dashboard our whole team now depends on. He asks better questions than most PMs I've worked with.",
    name: "Maria Santos",
    role: "Ops Director, Pasig Logistics Corp.",
    initial: "MS",
  },
  {
    body: "Our pre-order volume jumped within the first month of launch. The site is fast, beautiful, and our staff can actually update it.",
    name: "Tomas Reyes",
    role: "Owner, Kamayan Bakeshop (Makati)",
    initial: "TR",
  },
  {
    body: "We had scoped this as a 3-month project with a Manila agency. Keith delivered a better version in 6 weeks.",
    name: "Dr. Angela Lim",
    role: "Managing Partner, Cebu Smile Dental Group",
    initial: "AL",
  },
];

export function Testimonials() {
  return (
    <section className="container-page py-24">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="label-mono">What clients say</div>
          <h2 className="mt-4 font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Results, not just pixels.
          </h2>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {quotes.map((q, i) => (
          <FadeIn key={q.name} delay={i * 0.07}>
            <figure className="flex h-full flex-col rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-7">
              {/* Opening quote mark */}
              <span className="font-display text-5xl font-extrabold leading-none text-indigo-500/25 select-none" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="mt-1 flex-1 text-[15px] leading-relaxed text-white/70">
                {q.body}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-white"
                  aria-hidden
                >
                  {q.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{q.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
