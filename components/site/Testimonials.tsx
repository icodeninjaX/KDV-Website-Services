import { Quote } from "lucide-react";
import { FadeIn } from "./FadeIn";

const quotes = [
  {
    body: "Keith took a vague idea and turned it into a dashboard our whole team now depends on. He asks better questions than most PMs I've worked with.",
    name: "Maria Santos",
    role: "Ops Director, Pasig Logistics Corp.",
  },
  {
    body: "Our pre-order volume jumped within the first month of launch. The site is fast, beautiful, and our staff can actually update it.",
    name: "Tomas Reyes",
    role: "Owner, Kamayan Bakeshop (Makati)",
  },
  {
    body: "We had scoped this as a 3-month project with a Manila agency. Keith delivered a better version in 6 weeks.",
    name: "Dr. Angela Lim",
    role: "Managing Partner, Cebu Smile Dental Group",
  },
];

export function Testimonials() {
  return (
    <section className="container-page py-20">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-gradient">What clients say</div>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Results, not just pixels.
          </h2>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {quotes.map((q, i) => (
          <FadeIn key={q.name} delay={i * 0.08}>
            <figure className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <Quote className="absolute right-5 top-5 text-violet-500/30" size={28} />
              <blockquote className="text-[15px] leading-relaxed text-white/80">
                &ldquo;{q.body}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-white/5 pt-4">
                <div className="text-sm font-medium text-white">{q.name}</div>
                <div className="text-xs text-white/50">{q.role}</div>
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
