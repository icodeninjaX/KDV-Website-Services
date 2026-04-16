import { FadeIn } from "./FadeIn";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "A focused call to understand your business, your users, and the outcome you need. You walk away with a clear scope and quote.",
  },
  {
    n: "02",
    title: "Design",
    body: "Mockups before code. You approve the look, feel, and flow — no surprises once development starts.",
  },
  {
    n: "03",
    title: "Build",
    body: "I work in public on a staging URL you can check any time. Short feedback loops, no monthly black box.",
  },
  {
    n: "04",
    title: "Launch & support",
    body: "Go live on your infrastructure. 30 days of included support, plus a handoff doc so you're never stuck.",
  },
];

export function ProcessSteps() {
  return (
    <section className="container-page py-24">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="label-mono">How it works</div>
          <h2 className="mt-4 font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A simple, transparent process.
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed">
            No bloated retainers. No surprise invoices. Just a predictable path from idea to live.
          </p>
        </div>
      </FadeIn>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <FadeIn key={step.n} delay={i * 0.06}>
            <div className="relative h-full rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] p-6">
              <div className="font-display text-4xl font-extrabold text-white/[0.07] tabular-nums leading-none">
                {step.n}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
