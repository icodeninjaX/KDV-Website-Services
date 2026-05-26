"use client";

import { useState, useEffect } from "react";
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
// One full rotation of the conic border beam = 4000ms (see .border-spin in globals.css).
// CIRCLING_MS is slightly less so the card's beam feels "complete" before the streak takes over.
const CIRCLING_MS = 3700;
const TRANSIT_MS = 900;

type Phase = "circling" | "transit";

export function ProcessSteps() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("circling");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let id: ReturnType<typeof setTimeout>;
    const runCircling = () => {
      setPhase("circling");
      id = setTimeout(() => {
        setPhase("transit");
        id = setTimeout(() => {
          setActive((prev) => (prev + 1) % steps.length);
          runCircling();
        }, TRANSIT_MS);
      }, CIRCLING_MS);
    };
    runCircling();
    return () => clearTimeout(id);
  }, [reduce]);

  const isTraveling = phase === "transit" && active !== steps.length - 1;
  const streakLeft = isTraveling
    ? ORB_X[(active + 1) % steps.length]
    : ORB_X[active];

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
        {/* Traveling streak at mid-height — sits behind cards so it only shows in the gap */}
        {!reduce && (
          <div
            className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
            aria-hidden
          >
            {/* Faint track at mid-height showing the path */}
            <div
              className="absolute left-[12.5%] right-[12.5%] top-1/2 h-px -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 12%, rgba(255,255,255,0.07) 88%, transparent)",
              }}
            />
            {/* Snake streak — stretches while moving through the gap between cards */}
            <motion.div
              className="absolute top-1/2 h-[3px] w-10 rounded-full"
              style={{
                x: "-50%",
                y: "-50%",
                background:
                  "linear-gradient(90deg, rgba(99,102,241,0) 0%, #6366f1 35%, #a855f7 65%, rgba(168,85,247,0) 100%)",
                boxShadow:
                  "0 0 16px 3px rgba(99,102,241,0.65), 0 0 8px 2px rgba(168,85,247,0.5)",
              }}
              animate={{
                left: streakLeft,
                opacity: isTraveling ? 1 : 0,
                scaleX: isTraveling ? [1, 12, 1] : 1,
              }}
              transition={{
                left: {
                  duration: TRANSIT_MS / 1000,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: { duration: 0.25 },
                scaleX: {
                  duration: TRANSIT_MS / 1000,
                  times: [0, 0.5, 1],
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            />
          </div>
        )}

        <div className="relative z-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.06}>
              <div
                className={`border-spin-wrapper h-full${
                  active === i && !reduce && phase === "circling"
                    ? " is-active"
                    : ""
                }`}
              >
                <div className="relative z-10 h-full rounded-[15px] bg-[hsl(0_0%_6%)] p-6">
                  <div
                    className={`font-display text-4xl font-extrabold tabular-nums leading-none transition-colors duration-700 ease-in-out ${
                      active === i && !reduce && phase === "circling"
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
