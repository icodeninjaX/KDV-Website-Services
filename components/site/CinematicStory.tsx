"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  paperAtlas,
  plateAspect,
  storyChapters,
  storyPlates,
  storyTimeline,
  type StoryChapter,
  type StoryRange,
} from "@/lib/story";
import { cn } from "@/lib/utils";
import type { Layout, PaperScene } from "./paper-scene";

type Mode = "static" | "cinematic";

const WIDE_QUERY = "(min-width: 1024px) and (min-height: 600px)";
/** Landscape phones don't have the height for a pinned stage plus captions. */
const TALL_QUERY = "(min-height: 520px)";

type NetworkInformationLike = { saveData?: boolean; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Motion is opt-in by capability. Static for reduced motion, data saving, no WebGL,
 * very short viewports, and before hydration (server render = the static chapters).
 */
function useStoryMode(failed: boolean): { mode: Mode; layout: Layout } {
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ capable: boolean; layout: Layout }>({ capable: false, layout: "wide" });

  useEffect(() => {
    const wide = window.matchMedia(WIDE_QUERY);
    const tall = window.matchMedia(TALL_QUERY);
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const webgl = hasWebGL();
    const update = () =>
      setState({
        capable: webgl && tall.matches && !reducedData.matches && !connection?.saveData,
        layout: wide.matches ? "wide" : "narrow",
      });
    update();
    for (const mq of [wide, tall, reducedData]) mq.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      for (const mq of [wide, tall, reducedData]) mq.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  return { mode: state.capable && !reduce && !failed ? "cinematic" : "static", layout: state.layout };
}

/** Opacity envelope: fade in over [a, a+f], hold, fade out over [b-f, b]. */
function useWindow(progress: MotionValue<number>, [a, b]: StoryRange, fade = 0.03, holdEnd = false) {
  return useTransform(progress, [a, a + fade, b - fade, b], [0, 1, 1, holdEnd ? 1 : 0]);
}

/** Hidden captions and a faded hero must not keep focusable links. */
function useInertOutside(ref: React.RefObject<HTMLElement | null>, progress: MotionValue<number>, [a, b]: StoryRange, enabled: boolean, holdEnd = false) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = (p: number) => {
      el.inert = enabled && (p < a || (!holdEnd && p > b));
    };
    sync(progress.get());
    const unsubscribe = progress.on("change", sync);
    return () => {
      unsubscribe();
      el.inert = false;
    };
  }, [ref, progress, a, b, enabled, holdEnd]);
}

export function CinematicStory({ hero, chapters }: { hero: ReactNode; chapters: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const { mode, layout } = useStoryMode(failed);
  const cinematic = mode === "cinematic";
  const wide = layout === "wide";
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<PaperScene | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // One damped copy of scroll drives the scene and captions, so wheel steps read as continuous motion.
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.5, restDelta: 0.0002 });

  const introEnd = storyChapters[0].range[1];
  const heroOpacity = useTransform(progress, [introEnd * 0.55, introEnd], [1, 0]);
  const heroY = useTransform(progress, [0, introEnd], [0, -40]);
  useInertOutside(heroRef, scrollYProgress, [0, introEnd * 0.9], cinematic);

  // useScroll only re-measures on scroll/resize; the track just changed height.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, [mode]);

  // Scene lifetime: three.js is fetched only once the visitor is known to be capable.
  useEffect(() => {
    if (!cinematic) return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    let cancelled = false;
    let scene: PaperScene | null = null;
    let cleanup = () => {};

    import("./paper-scene")
      .then(({ createPaperScene }) => {
        if (cancelled) return;
        const narrow = !window.matchMedia(WIDE_QUERY).matches;
        scene = createPaperScene({
          canvas,
          atlasSrc: paperAtlas.src,
          plateSrcs: storyPlates.map((p) => p.src),
          plateAspect,
          gather: storyTimeline.gather,
          flips: storyTimeline.flips,
          dense: !narrow,
          onContextLost: () => setFailed(true),
        });
        sceneRef.current = scene;
        scene.setLayout(narrow ? "narrow" : "wide");
        scene.setProgress(progress.get());
        const rect = stage.getBoundingClientRect();
        scene.resize(rect.width, rect.height);

        const unsubscribe = progress.on("change", (v) => scene?.setProgress(v));
        const ro = new ResizeObserver(([entry]) => scene?.resize(entry.contentRect.width, entry.contentRect.height));
        ro.observe(stage);
        let inView = false;
        const sync = () => scene?.setActive(inView && document.visibilityState === "visible");
        const io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
        });
        io.observe(stage);
        document.addEventListener("visibilitychange", sync);

        scene.ready.then(() => !cancelled && setSceneReady(true)).catch(() => !cancelled && setFailed(true));
        cleanup = () => {
          unsubscribe();
          ro.disconnect();
          io.disconnect();
          document.removeEventListener("visibilitychange", sync);
        };
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      cleanup();
      scene?.dispose();
      sceneRef.current = null;
      setSceneReady(false);
    };
  }, [cinematic, progress]);

  useEffect(() => {
    sceneRef.current?.setLayout(layout);
  }, [layout, sceneReady]);

  return (
    <section aria-labelledby="hero-heading" data-story-mode={mode}>
      <div
        ref={trackRef}
        className="relative"
        style={cinematic ? { height: `${storyTimeline.trackHeightSvh}svh` } : undefined}
      >
        <div
          ref={stageRef}
          className={cn(
            "flex flex-col overflow-hidden",
            cinematic
              ? cn("sticky top-16 h-[calc(100svh-4rem)]", wide ? "justify-center" : "justify-end")
              : "relative md:min-h-[calc(100svh-4rem)] md:justify-center",
          )}
        >
          {cinematic && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <canvas
                ref={canvasRef}
                className={cn("absolute inset-0 h-full w-full transition-opacity duration-1000", sceneReady ? "opacity-100" : "opacity-0")}
              />
              <motion.div className={wide ? "story-scrim" : "story-scrim-narrow"} style={{ opacity: heroOpacity }} />
              <div className={wide ? "story-scrim-caption" : "story-scrim-caption-narrow"} />
              <div className="story-vignette" />
            </div>
          )}

          <motion.div
            ref={heroRef}
            className="relative"
            style={cinematic ? { opacity: heroOpacity, y: heroY } : undefined}
          >
            {hero}
          </motion.div>

          {cinematic && <StoryCaptions progress={progress} raw={scrollYProgress} wide={wide} />}
          {cinematic && wide && <ChapterIndex progress={progress} />}
          {cinematic && !wide && <ProgressRail progress={progress} />}
        </div>
      </div>
      {mode === "static" && chapters}
    </section>
  );
}

function StoryCaptions({ progress, raw, wide }: { progress: MotionValue<number>; raw: MotionValue<number>; wide: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex",
        wide ? "items-center" : "items-end pb-8",
      )}
    >
      <div className="container-page relative w-full">
        {storyChapters.slice(1).map((chapter, i, list) => (
          <Caption key={chapter.id} progress={progress} raw={raw} chapter={chapter} wide={wide} holdEnd={i === list.length - 1} />
        ))}
      </div>
    </div>
  );
}

function Caption({
  progress,
  raw,
  chapter,
  wide,
  holdEnd,
}: {
  progress: MotionValue<number>;
  raw: MotionValue<number>;
  chapter: StoryChapter;
  wide: boolean;
  holdEnd: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [a, b] = chapter.range;
  const opacity = useWindow(progress, [a, b], 0.03, holdEnd);
  const y = useTransform(progress, [a, a + 0.05], [24, 0]);
  useInertOutside(ref, raw, [a + 0.01, b - 0.01], true, holdEnd);
  const plate = "plate" in chapter ? storyPlates[chapter.plate] : null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-x-5 sm:inset-x-8",
        wide ? "top-1/2 max-w-sm -translate-y-1/2 xl:max-w-md" : "bottom-0 max-w-xl",
      )}
    >
      <motion.div style={{ opacity, y }} className="pointer-events-auto">
        <p className="label-mono">{chapter.label}</p>
        <h2
          className={cn(
            "text-balance font-display font-bold tracking-tight",
            wide ? "mt-4 text-4xl leading-[1.08] xl:text-5xl" : "mt-3 text-2xl leading-tight sm:text-3xl",
          )}
        >
          {chapter.heading}
        </h2>
        <p className={cn("leading-relaxed text-muted-foreground", wide ? "mt-5 text-lg" : "mt-3 text-base")}>{chapter.body}</p>
        {chapter.kind === "service" && (
          <p className="mt-4 text-sm text-foreground">
            {chapter.service.startingAt.startsWith("₱") ? `From ${chapter.service.startingAt}` : chapter.service.startingAt}
            <span className="mx-2 text-muted-foreground" aria-hidden>/</span>
            {chapter.service.timeline}
          </p>
        )}
        {plate && (
          <>
            <p className={cn("font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground", wide ? "mt-6" : "mt-4")}>
              On screen: {plate.project} / {plate.client} / {plate.screen}
            </p>
            <div className={cn("flex flex-wrap gap-x-5", wide ? "mt-3" : "mt-1")}>
              <CaptionLink href={`/portfolio/${plate.slug}`}>Case study</CaptionLink>
              {chapter.kind === "service" && <CaptionLink href={`/services/${chapter.service.slug}`}>{chapter.service.title}</CaptionLink>}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function CaptionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children} <ArrowRight size={14} aria-hidden />
    </Link>
  );
}

function ChapterIndex({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:right-8 xl:flex">
      {storyChapters.map((chapter, i) => (
        <IndexTick key={chapter.id} progress={progress} range={chapter.range} last={i === storyChapters.length - 1} />
      ))}
    </div>
  );
}

function IndexTick({ progress, range, last }: { progress: MotionValue<number>; range: StoryRange; last: boolean }) {
  const opacity = useTransform(progress, [range[0] - 0.01, range[0] + 0.01, range[1] - 0.01, range[1] + 0.01], [0.25, 1, 1, last ? 1 : 0.25]);
  return <motion.span style={{ opacity }} className="block h-6 w-0.5 rounded-full bg-foreground" />;
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-5 top-3 h-px bg-foreground/15 sm:inset-x-8">
      <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-foreground/70" />
    </div>
  );
}
