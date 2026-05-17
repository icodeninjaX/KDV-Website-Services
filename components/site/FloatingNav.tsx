"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = Math.min(window.innerHeight * 0.6, 520);
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = nav.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block",
        !visible && "pointer-events-none",
      )}
    >
      <motion.nav
        aria-label="Floating page navigation"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          x: visible || reduce ? 0 : 14,
        }}
        transition={{
          duration: reduce ? 0.12 : 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="mb-3 flex items-center justify-end gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/35">
            Index
          </span>
          <span aria-hidden className="h-px w-2.5 bg-white/25" />
        </div>

        <ul className="flex flex-col items-end gap-0.5">
          {nav.map((item, i) => {
            const active = i === activeIndex;
            const num = String(i + 1).padStart(2, "0");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-sm py-1 pl-4",
                    "transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:-translate-x-1.5 focus-visible:-translate-x-1.5",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50",
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-[13px] tracking-tight transition-all duration-300 ease-out",
                      active
                        ? "text-white opacity-100 translate-x-0"
                        : "text-white/80 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0",
                    )}
                  >
                    {item.label}
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "font-mono text-[10px] tabular-nums tracking-[0.1em] w-4 text-right transition-colors duration-300",
                      active
                        ? "text-white/80"
                        : "text-white/35 group-hover:text-white/70 group-focus-visible:text-white/70",
                    )}
                  >
                    {num}
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "h-px transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active
                        ? "w-8 bg-gradient-brand shadow-[0_0_12px_rgba(99,102,241,0.55)]"
                        : "w-2 bg-white/20 group-hover:w-5 group-hover:bg-white/50 group-focus-visible:w-5 group-focus-visible:bg-white/50",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex items-center justify-end gap-2">
          <span aria-hidden className="h-px w-2.5 bg-white/25" />
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] tabular-nums text-white/35">
            {String(Math.max(activeIndex + 1, 0)).padStart(2, "0")}
            <span className="text-white/20"> / </span>
            {String(nav.length).padStart(2, "0")}
          </span>
        </div>
      </motion.nav>
    </div>
  );
}
