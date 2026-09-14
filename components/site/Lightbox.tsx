"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { CaseStudyImage } from "@/lib/portfolio";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";

export function Gallery({ images }: { images: CaseStudyImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = index !== null;
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
    if (!isOpen) return;
    document.body.dataset.galleryOpen = "true";
    window.dispatchEvent(new Event("kdv:gallerychange"));
    return () => {
      delete document.body.dataset.galleryOpen;
      window.dispatchEvent(new Event("kdv:gallerychange"));
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []).filter((button) => button.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
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
  }, [isOpen, close, next, prev]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2">
        {images.map((shot, i) => (
          <FadeIn key={shot.src} delay={Math.min(i * 0.04, 0.2)}>
            <figure className="overflow-hidden rounded-2xl border border-white/[0.1] bg-card transition-colors hover:border-white/[0.18]">
              <Button variant="ghost"
                type="button"
                onClick={() => open(i)}
                aria-label={`Zoom: ${shot.caption ?? shot.alt}`}
                className="group relative block h-auto rounded-none p-0 aspect-[16/9] w-full cursor-zoom-in overflow-hidden border-b border-white/[0.08] bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 md:aspect-auto"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1920}
                  height={1080}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none md:static md:h-auto md:w-full md:object-contain md:transition-none md:group-hover:scale-100"
                />
                <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2 py-1 text-[11px] font-medium text-muted-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                  <ZoomIn size={12} aria-hidden /> Zoom
                </span>
              </Button>
              {shot.caption && (
                <figcaption className="px-5 py-4 text-sm text-muted-foreground">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          </FadeIn>
        ))}
      </div>

      {current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-3 pb-24 pt-16 backdrop-blur-sm sm:p-8"
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
          <Button variant="ghost"
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close image"
            className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 p-0 items-center justify-center rounded-full border border-white/15 bg-black/50 text-muted-foreground transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:right-4 sm:top-4"
          >
            <X size={18} aria-hidden />
          </Button>

          {images.length > 1 && (
            <>
              {/* Desktop side-flanking nav */}
              <Button variant="ghost"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-6 top-1/2 z-10 hidden h-11 w-11 p-0 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-muted-foreground transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:inline-flex"
              >
                <ChevronLeft size={20} aria-hidden />
              </Button>
              <Button variant="ghost"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-6 top-1/2 z-10 hidden h-11 w-11 p-0 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-muted-foreground transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 sm:inline-flex"
              >
                <ChevronRight size={20} aria-hidden />
              </Button>

              {/* Mobile bottom toolbar */}
              <div
                className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-3 sm:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="ghost"
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="inline-flex h-12 w-12 p-0 items-center justify-center rounded-full border border-white/15 bg-black/60 text-muted-foreground backdrop-blur transition-colors active:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                >
                  <ChevronLeft size={22} aria-hidden />
                </Button>
                {index !== null && (
                  <span className="inline-flex h-12 min-w-[64px] items-center justify-center rounded-full border border-white/15 bg-black/60 px-4 text-sm font-medium text-muted-foreground backdrop-blur">
                    {index + 1} / {images.length}
                  </span>
                )}
                <Button variant="ghost"
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="inline-flex h-12 w-12 p-0 items-center justify-center rounded-full border border-white/15 bg-black/60 text-muted-foreground backdrop-blur transition-colors active:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
                >
                  <ChevronRight size={22} aria-hidden />
                </Button>
              </div>
            </>
          )}

          <figure
            className="relative flex max-h-full w-full max-w-[96vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex max-h-[65dvh] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background sm:max-h-[80dvh]">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={1920}
                height={1080}
                priority
                sizes="96vw"
                className="h-auto max-h-[65dvh] w-auto max-w-full object-contain sm:max-h-[80dvh]"
              />
            </div>
            {current.caption && (
              <figcaption className="mt-3 hidden w-full items-center justify-between gap-4 text-sm text-muted-foreground sm:flex">
                <span className="truncate">{current.caption}</span>
                {images.length > 1 && index !== null && (
                  <span className="shrink-0 text-muted-foreground">
                    {index + 1} / {images.length}
                  </span>
                )}
              </figcaption>
            )}
            {current.caption && (
              <figcaption className="mt-3 w-full text-center text-sm leading-relaxed text-muted-foreground sm:hidden">
                {current.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
