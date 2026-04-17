"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

// Center x of each column in a 4-column equal-width grid
const ORB_X = ["12.5%", "37.5%", "62.5%", "87.5%"];
const CYCLE_MS = 4000;

export function ProcessSteps() {
  const [active, setActive] = useState(0);
  const prevRef = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setActive((prev) => {
        prevRef.current = prev;
        return (prev + 1) % steps.length;
      });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // When looping from last card back to first, jump instantly so orb doesn't fly backwards
  const isLoopBack = active === 0 && prevRef.current === steps.length - 1;

  return (
    <section className="container-page py-16 sm:py-20 lg:py-24">
      <FadeIn>
        <div className="max-w-2xl">
          <div className="label-mono">How it works</div>
          <h2 className="mt-4 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A simple, transparent process.
          </h2>
          <p className="mt-4 text-white/55 leading-relaxed text-[15px] sm:text-base text-justify">
            No bloated retainers. No surprise invoices. Just a predictable path from idea to live.
          </p>
        </div>
      </FadeIn>

      <div className="relative mt-10 sm:mt-14">
        {/* Orb that travels along the top border between cards — desktop 4-col only */}
        {!reduce && (
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 hidden lg:block"
            aria-hidden
          >
            <motion.div
              className="absolute top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400"
              style={{
                boxShadow:
                  "0 0 10px 5px rgba(99,102,241,0.65), 0 0 3px 2px rgba(168,85,247,0.5)",
              }}
              animate={{ left: ORB_X[active] }}
              transition={{
                duration: isLoopBack ? 0 : 0.65,
                ease: "easeInOut",
              }}
            />
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.06}>
              <div
                className={
                  active === i && !reduce
                    ? "border-spin-wrapper h-full"
                    : "relative h-full overflow-hidden rounded-2xl p-px bg-white/[0.08]"
                }
              >
                <div className="relative z-10 h-full rounded-[15px] bg-[hsl(0_0%_6%)] p-6">
                  <div
                    className={`font-display text-4xl font-extrabold tabular-nums leading-none transition-colors duration-500 ${
                      active === i && !reduce
                        ? "text-gradient"
                        : "text-white/[0.07]"
                    }`}
                  >
                    {step.n}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55 text-justify">
                    {step.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
