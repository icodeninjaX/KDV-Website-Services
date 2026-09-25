"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { storyChapters, storyMedia, storyTimeline, systemTiers, type StoryRange } from "@/lib/story";
import { cn } from "@/lib/utils";
import { ScrubVideo } from "./ScrubVideo";
import { CompactStory } from "./CompactStory";

type Mode = "static" | "compact" | "cinematic";

const CINEMATIC_QUERY = "(min-width: 1024px) and (min-height: 600px)";
/** Below the cinematic breakpoint, the pinned compact sequence needs this much height to breathe. */
const COMPACT_QUERY = "(min-height: 520px)";

type NetworkInformationLike = { saveData?: boolean; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };

/**
 * Motion is opt-in by capability: cinematic on wide viewports, compact on narrow/portrait
 * ones, static for reduced motion, data saving, very short viewports, and before hydration.
 */
function useStoryMode(): Mode {
  const reduce = useReducedMotion();
  const [capable, setCapable] = useState<Exclude<Mode, "static"> | null>(null);

  useEffect(() => {
    const wide = window.matchMedia(CINEMATIC_QUERY);
    const tall = window.matchMedia(COMPACT_QUERY);
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const update = () => {
      if (reducedData.matches || connection?.saveData) setCapable(null);
      else if (wide.matches) setCapable("cinematic");
      else if (tall.matches) setCapable("compact");
      else setCapable(null);
    };
    update();
    for (const mq of [wide, tall, reducedData]) mq.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      for (const mq of [wide, tall, reducedData]) mq.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  return capable && !reduce ? capable : "static";
}

/** Opacity envelope: fade in over [a, a+f], hold, fade out over [b-f, b]. */
function useWindow(progress: MotionValue<number>, [a, b]: StoryRange, fade = 0.035, holdEnd = false) {
  return useTransform(progress, [a, a + fade, b - fade, b], [0, 1, 1, holdEnd ? 1 : 0]);
}

export function CinematicStory({ hero, chapters }: { hero: ReactNode; chapters: ReactNode }) {
  const mode = useStoryMode();
  const cinematic = mode === "cinematic";
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // One damped copy of scroll drives every visual, so wheel steps read as continuous motion.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5, restDelta: 0.0002 });

  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoArmed, setVideoArmed] = useState(false);
  const onVideoReady = useCallback(() => setVideoReady(true), []);
  const onVideoFail = useCallback(() => setVideoFailed(true), []);

  const introEnd = storyChapters[0].range[1];
  const [, videoEnd] = storyTimeline.videoRange;
  const [proofStart] = storyTimeline.proofRange;
  const screen = storyMedia.proofScreen;

  const heroOpacity = useTransform(progress, [introEnd * 0.55, introEnd], [1, 0]);
  const heroY = useTransform(progress, [0, introEnd], [0, -40]);
  // Slow drift through the story, then a push into the laptop screen for the hand-off.
  const [systemStart] = storyChapters[2].range;
  const cameraScale = useTransform(
    progress,
    [0, systemStart, systemStart + 0.1, videoEnd, proofStart + 0.14],
    [1, 1.04, storyTimeline.pullBack, storyTimeline.pullBack, storyTimeline.proofZoom],
  );
  const proofOpacity = useTransform(progress, [proofStart + 0.03, proofStart + 0.1], [0, 1]);

  // useScroll only re-measures on scroll/resize; the track just changed height, so
  // without this the first frame can use progress computed for the static layout.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, [mode]);

  // Fetch the clip on the first real scroll, not on load; the poster holds until it's ready.
  // (Keyed to the scroll event, not progress: progress can briefly read stale after the mode switch.)
  useEffect(() => {
    if (!cinematic || videoArmed) return;
    const arm = () => setVideoArmed(true);
    if (window.scrollY > 0) arm();
    window.addEventListener("scroll", arm, { once: true, passive: true });
    return () => window.removeEventListener("scroll", arm);
  }, [cinematic, videoArmed]);

  // Faded hero controls must not stay focusable.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const sync = (p: number) => {
      hero.inert = cinematic && p > introEnd * 0.9;
    };
    sync(scrollYProgress.get());
    const unsubscribe = scrollYProgress.on("change", sync);
    return () => {
      unsubscribe();
      hero.inert = false;
    };
  }, [cinematic, scrollYProgress, introEnd]);

  const still = storyMedia.stills.scattered;
  const video = storyMedia.video;
  const showVideo = cinematic && videoArmed && !!video && !videoFailed;
  const useStills = cinematic && (!video || videoFailed);

  return (
    <section aria-labelledby="hero-heading" data-story-mode={mode}>
      <div
        ref={trackRef}
        className="relative"
        style={cinematic ? { height: `${storyTimeline.trackHeightSvh}svh` } : undefined}
      >
        <div
          className={cn(
            "flex flex-col overflow-hidden",
            cinematic
              ? "sticky top-16 h-[calc(100svh-4rem)] justify-center"
              : "relative md:min-h-[calc(100svh-4rem)] md:justify-center",
          )}
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none",
              cinematic ? "absolute inset-0" : "relative order-2 md:absolute md:inset-0 md:order-none",
              (!still || mode === "compact") && !cinematic && "hidden md:block",
            )}
          >
            <div className="story-backdrop absolute inset-0" />
            {cinematic ? (
              <div className="absolute inset-0 [container-type:size]">
                <motion.div
                  className="story-camera"
                  style={{ scale: cameraScale, transformOrigin: `${(screen.x + screen.w / 2) * 100}% ${(screen.y + screen.h / 2) * 100}%` }}
                >
                  {still && (
                    <Image src={still.src} alt="" fill priority sizes="100vw" className="object-cover" />
                  )}
                  {useStills && <StoryStills progress={progress} />}
                  {showVideo && (
                    <motion.div className="absolute inset-0" style={{ opacity: videoReady ? 1 : 0 }}>
                      <ScrubVideo
                        progress={progress}
                        range={storyTimeline.videoRange}
                        sources={video.sources}
                        onReady={onVideoReady}
                        onFail={onVideoFail}
                        className="absolute inset-0 h-full w-full object-cover"
                        fade={false}
                      />
                    </motion.div>
                  )}
                  <motion.div
                    className="absolute overflow-hidden bg-card"
                    style={{
                      opacity: proofOpacity,
                      left: `${screen.x * 100}%`,
                      top: `${screen.y * 100}%`,
                      width: `${screen.w * 100}%`,
                      height: `${screen.h * 100}%`,
                    }}
                  >
                    <Image src={storyMedia.proof.src} alt="" fill sizes="50vw" className="object-cover object-left-top" />
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <div className="story-frame relative aspect-[4/3] md:aspect-auto">
                {still && (
                  <Image
                    src={still.src}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: still.focus }}
                  />
                )}
              </div>
            )}
            {cinematic ? (
              <>
                <motion.div className="story-scrim absolute inset-0" style={{ opacity: heroOpacity }} />
                <div className="story-scrim-caption absolute inset-0" />
              </>
            ) : (
              <div className="story-scrim absolute inset-0 hidden md:block" />
            )}
          </div>

          <motion.div
            ref={heroRef}
            className="relative order-1"
            style={cinematic ? { opacity: heroOpacity, y: heroY } : undefined}
          >
            {hero}
          </motion.div>

          {cinematic && <StoryCaptions progress={progress} />}
          {cinematic && <ChapterIndex progress={progress} />}
        </div>
      </div>
      {mode === "static" && chapters}
      {mode === "compact" && <CompactStory />}
    </section>
  );
}

function StoryCaptions({ progress }: { progress: MotionValue<number> }) {
  const [, connect, system, proof] = storyChapters;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center">
      <div className="container-page relative">
        <Caption progress={progress} range={connect.range} chapter={connect} />
        <Caption progress={progress} range={system.range} chapter={system}>
          <ol className="mt-7 space-y-4">
            {systemTiers.map((tier, i) => (
              <TierItem key={tier.service} progress={progress} range={storyTimeline.tierRanges[i]} index={i} {...tier} />
            ))}
          </ol>
        </Caption>
        <Caption progress={progress} range={proof.range} chapter={proof} holdEnd>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            On screen: {storyMedia.proof.project} / {storyMedia.proof.client} / admin dashboard
          </p>
        </Caption>
      </div>
    </div>
  );
}

function Caption({
  progress,
  range,
  chapter,
  holdEnd,
  children,
}: {
  progress: MotionValue<number>;
  range: StoryRange;
  chapter: (typeof storyChapters)[number];
  holdEnd?: boolean;
  children?: ReactNode;
}) {
  const opacity = useWindow(progress, [range[0] + 0.008, range[1]], 0.035, holdEnd);
  const y = useTransform(progress, [range[0] + 0.008, range[0] + 0.06], [24, 0]);
  return (
    <div className="absolute inset-x-5 top-1/2 max-w-sm -translate-y-1/2 sm:inset-x-8 xl:max-w-md">
      <motion.div style={{ opacity, y }}>
        <p className="label-mono">{chapter.label}</p>
        <h2 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">{chapter.heading}</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{chapter.body}</p>
        {children}
      </motion.div>
    </div>
  );
}

function TierItem({
  progress,
  range,
  index,
  title,
  role,
}: {
  progress: MotionValue<number>;
  range: StoryRange;
  index: number;
  title: string;
  role: string;
}) {
  const [a, b] = range;
  const lit = useTransform(progress, [a - 0.015, a + 0.015, b - 0.015, b + 0.015], [0, 1, 1, index === 2 ? 1 : 0]);
  const opacity = useTransform(lit, [0, 1], [0.78, 1]);
  const bar = useTransform(lit, [0, 1], [0.15, 1]);
  return (
    <motion.li style={{ opacity }} className="flex gap-4">
      <motion.span aria-hidden style={{ scaleY: bar }} className="mt-1 w-0.5 shrink-0 origin-top self-stretch rounded-full bg-primary" />
      <div>
        <p className="font-medium text-foreground">
          <span className="mr-2 font-mono text-sm text-muted-foreground">0{index + 1}</span>
          {title}
        </p>
        <p className="mt-1 text-base leading-relaxed text-muted-foreground">{role}</p>
      </div>
    </motion.li>
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

/** Without the clip, crossfade the keyframes through the same beats. */
function StoryStills({ progress }: { progress: MotionValue<number> }) {
  const { connected, system } = storyMedia.stills;
  const [, connect, systemChapter] = storyChapters;
  const connectedOpacity = useTransform(progress, [connect.range[0] + 0.1, connect.range[1]], [0, 1]);
  const systemOpacity = useTransform(progress, [systemChapter.range[0] + 0.05, systemChapter.range[1] - 0.05], [0, 1]);
  return (
    <>
      {connected && (
        <motion.div style={{ opacity: connectedOpacity }} className="absolute inset-0">
          <Image src={connected.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: connected.focus }} />
        </motion.div>
      )}
      {system && (
        <motion.div style={{ opacity: systemOpacity }} className="absolute inset-0">
          <Image src={system.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: system.focus }} />
        </motion.div>
      )}
    </>
  );
}
