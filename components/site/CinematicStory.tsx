"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { storyChapters, storyMedia, storyTimeline, systemTiers, type StoryRange } from "@/lib/story";
import { cn } from "@/lib/utils";
import { StoryScene } from "./StoryScene";
import { Schematic } from "./StorySchematic";
import { ScrubVideo } from "./ScrubVideo";

type Mode = "static" | "cinematic";

const CINEMATIC_QUERY = "(min-width: 1024px) and (min-height: 600px)";

type NetworkInformationLike = { saveData?: boolean; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };

/** Cinematic only for wide viewports without reduced-motion or data-saving preferences. */
function useStoryMode(): Mode {
  const reduce = useReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const viewport = window.matchMedia(CINEMATIC_QUERY);
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const update = () => setCapable(viewport.matches && !reducedData.matches && !connection?.saveData);
    update();
    viewport.addEventListener("change", update);
    reducedData.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      viewport.removeEventListener("change", update);
      reducedData.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  return capable && !reduce ? "cinematic" : "static";
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

  const [sceneFailed, setSceneFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoArmed, setVideoArmed] = useState(false);
  const onSceneFail = useCallback(() => setSceneFailed(true), []);
  const onVideoReady = useCallback(() => setVideoReady(true), []);
  const onVideoFail = useCallback(() => setVideoFailed(true), []);

  const heroOpacity = useTransform(scrollYProgress, [0.1, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);
  const posterOpacity = useTransform(scrollYProgress, [0.17, 0.23], [1, 0]);
  const posterScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.06]);

  // useScroll only re-measures on scroll/resize; the track just changed height, so
  // without this the first frame can use progress computed for the static layout.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, [cinematic]);

  // Don't fetch the clip for visitors who never scroll; the scene covers its range until it's ready.
  useEffect(() => {
    if (!cinematic || videoArmed) return;
    const arm = (p: number) => {
      if (p > 0.02) setVideoArmed(true);
    };
    arm(scrollYProgress.get());
    return scrollYProgress.on("change", arm);
  }, [cinematic, videoArmed, scrollYProgress]);

  // Faded hero controls must not stay focusable.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const sync = (p: number) => {
      hero.inert = cinematic && p > 0.17;
    };
    sync(scrollYProgress.get());
    const unsubscribe = scrollYProgress.on("change", sync);
    return () => {
      unsubscribe();
      hero.inert = false;
    };
  }, [cinematic, scrollYProgress]);

  const still = storyMedia.stills.scattered;
  const video = storyMedia.video;
  const showVideo = cinematic && videoArmed && !!video && !videoFailed;

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
              !still && !cinematic && "hidden md:block",
            )}
          >
            <div className="story-backdrop absolute inset-0" />
            {cinematic && !sceneFailed && (
              <StoryScene progress={scrollYProgress} videoCovers={showVideo && videoReady} onFail={onSceneFail} />
            )}
            {cinematic && sceneFailed && <StoryStills progress={scrollYProgress} videoCovers={showVideo && videoReady} />}
            {showVideo && (
              <ScrubVideo
                progress={scrollYProgress}
                range={storyTimeline.videoRange}
                sources={video.sources}
                onReady={onVideoReady}
                onFail={onVideoFail}
              />
            )}
            {still && (
              <motion.div
                className="story-frame relative aspect-[4/3] md:aspect-auto"
                style={cinematic ? { opacity: posterOpacity, scale: posterScale } : undefined}
              >
                <Image
                  src={still.src}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: still.focus }}
                />
              </motion.div>
            )}
            <div className="story-scrim absolute inset-0 hidden md:block" />
          </div>

          <motion.div
            ref={heroRef}
            className="relative order-1"
            style={cinematic ? { opacity: heroOpacity, y: heroY } : undefined}
          >
            {hero}
          </motion.div>

          {cinematic && <StoryCaptions progress={scrollYProgress} />}
          {cinematic && <ChapterIndex progress={scrollYProgress} />}
        </div>
      </div>
      {!cinematic && chapters}
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
            {storyMedia.proof.project} / {storyMedia.proof.client} / admin dashboard
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
  const opacity = useWindow(progress, [range[0] + 0.008, range[1]], 0.03, holdEnd);
  const y = useTransform(progress, [range[0] + 0.008, range[0] + 0.05], [24, 0]);
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

/** Poster-based fallback when WebGL is unavailable or the context is lost. */
function StoryStills({ progress, videoCovers }: { progress: MotionValue<number>; videoCovers: boolean }) {
  const { connected, system } = storyMedia.stills;
  const connectedOpacity = useWindow(progress, [0.2, 0.52], 0.03);
  const systemOpacity = useWindow(progress, [0.5, 0.82], 0.03);
  const proofOpacity = useWindow(progress, [0.8, 1], 0.03, true);
  return (
    <>
      {!videoCovers && (
        <motion.div style={{ opacity: connectedOpacity }} className="absolute inset-0">
          {connected ? (
            <div className="story-frame">
              <Image src={connected.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: connected.focus }} />
            </div>
          ) : (
            <SchematicFrame variant="connect" />
          )}
        </motion.div>
      )}
      <motion.div style={{ opacity: systemOpacity }} className="absolute inset-0">
        {system ? (
          <div className="story-frame">
            <Image src={system.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: system.focus }} />
          </div>
        ) : (
          <SchematicFrame variant="system" />
        )}
      </motion.div>
      <motion.div style={{ opacity: proofOpacity }} className="absolute inset-y-0 right-0 flex w-[56%] items-center pr-10">
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card" style={{ aspectRatio: `${storyMedia.proof.width} / ${storyMedia.proof.height}` }}>
          <Image src={storyMedia.proof.src} alt="" fill sizes="56vw" className="object-cover object-left-top" />
        </div>
      </motion.div>
    </>
  );
}

function SchematicFrame({ variant }: { variant: "connect" | "system" }) {
  return (
    <div className="absolute inset-y-0 right-0 flex w-[54%] items-center pr-10">
      <div className="aspect-[4/3] w-full">
        <Schematic variant={variant} />
      </div>
    </div>
  );
}
