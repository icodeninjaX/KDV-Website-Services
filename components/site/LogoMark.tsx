"use client";

import Image from "next/image";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiVercel,
  SiPostgresql,
  SiXendit,
} from "react-icons/si";
import type { LogoItem } from "@/lib/logos";

const iconMap: Record<string, IconType> = {
  nextjs: SiNextdotjs,
  vercel: SiVercel,
  postgres: SiPostgresql,
  xendit: SiXendit,
};

/**
 * Renders a monochrome wordmark for the TrustBar.
 * - If the logo resolves via a slug, render the react-icons SVG component.
 * - Otherwise load the image from /public/logos/ and fall back to the brand
 *   name in text if the file is missing — so the site never shows broken
 *   images while you're sourcing regional assets.
 */
export function LogoMark({ item }: { item: LogoItem }) {
  const [errored, setErrored] = useState(false);

  if ("iconSlug" in item) {
    const Icon = iconMap[item.iconSlug];
    return (
      <Icon
        aria-hidden
        className="h-6 w-auto select-none text-white/50 transition-colors duration-200 hover:text-white sm:h-7"
      />
    );
  }

  if (errored) {
    return (
      <span className="font-display text-base font-semibold tracking-tight text-white/40 sm:text-lg">
        {item.name}
      </span>
    );
  }

  return (
    <Image
      src={`/logos/${item.file}`}
      alt=""
      width={item.width}
      height={item.height}
      onError={() => setErrored(true)}
      className="h-6 w-auto select-none object-contain opacity-50 transition-opacity duration-200 [filter:brightness(0)_invert(1)] hover:opacity-100 sm:h-7"
      unoptimized
      draggable={false}
    />
  );
}
