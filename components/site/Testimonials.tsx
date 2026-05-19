import { FadeIn } from "./FadeIn";

const feedback = [
  {
    body: "The New Z1on LPG team moved phone and walk-in orders into one cleaner workflow, giving staff one screen for orders instead of scattered notes.",
    name: "Toots Abella",
    role: "Hiring manager, New Z1on LPG",
    initial: "TA",
  },
  {
    body: "The cooperative officer needed a simple mobile way to see members, contributions, loans, and shares. The delivered app became the daily operating view.",
    name: "Cooperative officer",
    role: "Private cooperative, PH",
    initial: "C",
  },
  {
    body: "The X-Meta team replaced spreadsheet-heavy reporting with one admin panel for bookings, finance, devices, programs, and operational monitoring.",
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
          <div className="label-mono">Client feedback</div>
          <h2 className="mt-4 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Verified projects, careful framing.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            These are summarized takeaways from real client projects. Direct quotes
            will be added only after explicit permission.
          </p>
        </div>
      </FadeIn>

      <div className="mt-10 sm:mt-12 grid gap-5 md:grid-cols-3">
        {feedback.map((q, i) => (
          <FadeIn key={q.name} delay={i * 0.07}>
            <figure className="flex h-full flex-col rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6 sm:p-7">
              <div className="label-mono text-indigo-300/70">Summarized feedback</div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/70">
                {q.body}
              </p>
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
