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
    <section className="container-page py-20">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-gradient">How it works</div>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A simple, transparent process.
          </h2>
          <p className="mt-4 text-white/60">
            No bloated retainers. No surprise invoices. Just a predictable path from idea to live.
          </p>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <FadeIn key={step.n} delay={i * 0.06}>
            <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="font-mono text-xs tracking-wider text-gradient">{step.n}</div>
              <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
