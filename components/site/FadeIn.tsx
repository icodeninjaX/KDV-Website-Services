"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * FadeIn — reveals content with a subtle opacity+translate animation.
 *
 * @param mount  When true, animates on mount (use for above-the-fold / hero content).
 *               When false (default), animates when the element enters the viewport.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
  as = "div",
  mount = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  mount?: boolean;
}) {
  const shouldReduce = useReducedMotion();
  const MotionTag = motion[as];

  const duration = shouldReduce ? 0.12 : 0.25;
  const effectiveDelay = shouldReduce ? 0 : delay;
  const activeVariants = shouldReduce ? reducedVariants : variants;

  if (mount) {
    return (
      <MotionTag
        className={className}
        initial="hidden"
        animate="visible"
        transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: effectiveDelay }}
        variants={activeVariants}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: effectiveDelay }}
      variants={activeVariants}
    >
      {children}
    </MotionTag>
  );
}
