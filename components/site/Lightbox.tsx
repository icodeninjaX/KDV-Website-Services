"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { CaseStudyImage } from "@/lib/portfolio";
import { FadeIn } from "./FadeIn";

export function Gallery({ images }: { images: CaseStudyImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const open = useCallback((i: number) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    queueMicrotask(() => lastFocusedRef.current?.focus?.());
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, next, prev]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2">
        {images.map((shot, i) => (
          <FadeIn key={shot.src} delay={Math.min(i * 0.04, 0.2)}>
            <figure className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[hsl(0_0%_6%)] transition-colors hover:border-white/[0.18]">
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`Zoom: ${shot.caption ?? shot.alt}`}
                className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden border-b border-white/[0.08] bg-[hsl(0_0%_4%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[11px] font-medium text-white/85 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                  <ZoomIn size={12} aria-hidden /> Zoom
                </span>
              </button>
              {shot.caption && (
                <figcaption className="px-5 py-4 text-sm text-white/60">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          </FadeIn>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-3 pb-24 pt-4 backdrop-blur-sm sm:p-8"
          onClick={close}
          onTouchStart={(e) => {
            const t = e.changedTouches[0];
            touchStartXRef.current = t.clientX;
            touchStartYRef.current = t.clientY;
          }}
          onTouchEnd={(e) => {
            const startX = touchStartXRef.current;
            const startY = touchStartYRef.current;
            touchStartXRef.current = null;
            touchStartYRef.current = null;
            if (startX === null || startY === null || images.length <= 1) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
              if (dx < 0) next();
              else prev();
            }
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close image"
            className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:right-4 sm:top-4"
          >
            <X size={18} aria-hidden />
          </button>

          {images.length > 1 && (
            <>
              {/* Desktop side-flanking nav */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-6 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:inline-flex"
              >
                <ChevronLeft size={20} aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-6 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:inline-flex"
              >
                <ChevronRight size={20} aria-hidden />
              </button>

              {/* Mobile bottom toolbar */}
              <div
                className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-3 sm:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/85 backdrop-blur transition-colors active:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                >
                  <ChevronLeft size={22} aria-hidden />
                </button>
                {index !== null && (
                  <span className="inline-flex h-12 min-w-[64px] items-center justify-center rounded-full border border-white/15 bg-black/60 px-4 text-sm font-medium text-white/80 backdrop-blur">
                    {index + 1} / {images.length}
                  </span>
                )}
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/85 backdrop-blur transition-colors active:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                >
                  <ChevronRight size={22} aria-hidden />
                </button>
              </div>
            </>
          )}

          <figure
            className="relative flex max-h-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[78vh] w-full overflow-hidden rounded-xl border border-white/10 bg-[hsl(0_0%_4%)] sm:max-h-[80vh]">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={1920}
                height={1080}
                priority
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="h-auto max-h-[78vh] w-auto object-contain sm:max-h-[80vh]"
              />
            </div>
            {current.caption && (
              <figcaption className="mt-3 hidden w-full items-center justify-between gap-4 text-sm text-white/70 sm:flex">
                <span className="truncate">{current.caption}</span>
                {images.length > 1 && index !== null && (
                  <span className="shrink-0 text-white/40">
                    {index + 1} / {images.length}
                  </span>
                )}
              </figcaption>
            )}
            {current.caption && (
              <figcaption className="mt-3 w-full text-center text-sm leading-relaxed text-white/70 sm:hidden">
                {current.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
