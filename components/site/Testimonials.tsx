import { FadeIn } from "./FadeIn";

const quotes = [
  {
    body: "Keith built us a CMS and POS dashboard that cut our ordering process by around 90%. Our staff stopped chasing phone orders. Everything lives on one screen now.",
    name: "Toots Abella",
    role: "Hiring manager, New Z1on LPG",
    initial: "TA",
  },
  {
    body: "I needed something simple on my phone to keep track of our members. Keith listened, asked the right questions, and delivered something I actually use every day.",
    name: "Cooperative officer",
    role: "Private cooperative, PH",
    initial: "C",
  },
  {
    body: "371admin gave us the fleet visibility and reporting we couldn't get from spreadsheets. Keith understood the internal-tooling brief quickly and shipped without hand-holding.",
    name: "Sai Maloles",
    role: "IT Head, X-Meta Technologies",
    initial: "SM",
  },
];

export function Testimonials() {
  return (
    <section className="container-page py-16 sm:py-20 lg:py-24">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="label-mono">What clients say</div>
          <h2 className="mt-4 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Results, not just pixels.
          </h2>
        </div>
      </FadeIn>

      <div className="mt-10 sm:mt-12 grid gap-5 md:grid-cols-3">
        {quotes.map((q, i) => (
          <FadeIn key={q.name} delay={i * 0.07}>
            <figure className="flex h-full flex-col rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 sm:p-7">
              {/* Opening quote mark */}
              <span className="font-display text-5xl font-extrabold leading-none text-indigo-500/25 select-none" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="mt-1 flex-1 text-[15px] leading-relaxed text-white/70 text-justify">
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
