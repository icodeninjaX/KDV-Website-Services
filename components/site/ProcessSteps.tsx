import { FadeIn } from "./FadeIn";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "We talk about your business and what you need. You get a clear scope and a fixed quote.",
  },
  {
    n: "02",
    title: "Design",
    body: "You see the layout before any code is written. Review it, request changes, then approve.",
  },
  {
    n: "03",
    title: "Build",
    body: "Development happens on a live staging link you can visit anytime. No guessing, no waiting.",
  },
  {
    n: "04",
    title: "Launch & support",
    body: "Your site goes live on your own hosting. 30 days of support included after launch.",
  },
];

export function ProcessSteps() {
  return (
    <section className="container-page py-16 sm:py-20">
      <FadeIn>
        <p className="label-mono">How it works</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">A clear next step, at every stage.</h2>
      </FadeIn>
      <ol className="mt-10 grid gap-8 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.n} className="border-t border-border pt-6">
            <span className="font-mono text-lg text-muted-foreground">{step.n}</span>
            <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
