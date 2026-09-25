"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { compactTimeline, storyChapters, storyMedia, systemTiers, type StoryRange } from "@/lib/story";
import { ScrubVideo } from "./ScrubVideo";

const MEDIA_LAYER = "absolute inset-0 h-full w-full object-cover";

/**
 * Mobile/portrait telling of the sequence: pinned square visual with captions
 * below, driven by native scroll. Video + stills only.
 */
export function CompactStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const [armed, setArmed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const onReady = useCallback(() => setVideoReady(true), []);
  const onFail = useCallback(() => setVideoFailed(true), []);

  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, []);

  // Fetch the clip on the first scroll, not on load — most of this audience is on mobile data.
  useEffect(() => {
    if (armed) return;
    const arm = () => setArmed(true);
    if (window.scrollY > 0) arm();
    window.addEventListener("scroll", arm, { once: true, passive: true });
    return () => window.removeEventListener("scroll", arm);
  }, [armed]);

  const { connect, system, proof } = compactTimeline.chapters;
  const [, connectCopy, systemCopy, proofCopy] = storyChapters;
  const video = storyMedia.compact.video;
  const showVideo = armed && !!video && !videoFailed;
  const videoCovers = showVideo && videoReady;

  const [vStart, vEnd] = compactTimeline.videoRange;
  const videoOpacity = useTransform(progress, [proof[0] - 0.02, proof[0] + 0.04], [1, 0]);
  // Without the clip, crossfade the keyframes through the same beats.
  const connectedOpacity = useTransform(progress, [vStart + 0.12, connect[1] - 0.04, connect[1] + 0.04], [0, 1, 0]);
  const systemOpacity = useTransform(progress, [system[0] - 0.04, system[0] + 0.04, vEnd, vEnd + 0.06], [0, 1, 1, 0]);
  const proofOpacity = useTransform(progress, [proof[0] - 0.02, proof[0] + 0.04], [0, 1]);
  const { poster } = storyMedia.compact;
  const { connected, system: systemStill } = storyMedia.stills;

  return (
    <div ref={trackRef} className="relative" style={{ height: `${compactTimeline.trackHeightSvh}svh` }}>
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col overflow-hidden">
        <div aria-hidden className="story-feather pointer-events-none relative mx-auto mt-4 w-[min(100%,calc((100svh-4rem)*0.55))] shrink-0 overflow-hidden" style={{ aspectRatio: storyMedia.compact.aspect }}>
          <Image src={poster.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          {!videoCovers && connected && (
            <motion.div style={{ opacity: connectedOpacity }} className="absolute inset-0">
              <Image src={connected.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: storyMedia.compact.stillFocus }} />
            </motion.div>
          )}
          {showVideo && (
            <motion.div style={{ opacity: videoReady ? videoOpacity : 0 }} className="absolute inset-0">
              <ScrubVideo
                progress={progress}
                range={compactTimeline.videoRange}
                sources={video.sources}
                onReady={onReady}
                onFail={onFail}
                className={MEDIA_LAYER}
                fade={false}
              />
            </motion.div>
          )}
          {!videoCovers && systemStill && (
            <motion.div style={{ opacity: systemOpacity }} className="absolute inset-0">
              <Image src={systemStill.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: storyMedia.compact.stillFocus }} />
            </motion.div>
          )}
          <motion.div style={{ opacity: proofOpacity }} className="absolute inset-0 flex items-center bg-background px-1">
            {/* A 4:3 crop from the top-left keeps the real dashboard legible at phone width. */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-card">
              <Image src={storyMedia.proof.src} alt="" fill sizes="100vw" className="object-cover object-left-top" />
            </div>
          </motion.div>
        </div>

        <ChapterBar progress={progress} />

        <div className="container-page relative flex-1">
          <Caption progress={progress} range={connect} label={connectCopy.label} heading={connectCopy.heading} body={connectCopy.body} />
          <Caption progress={progress} range={system} label={systemCopy.label} heading={systemCopy.heading}>
            <ol className="mt-4 space-y-2">
              {systemTiers.map((tier, i) => (
                <Tier key={tier.service} progress={progress} range={compactTimeline.tierRanges[i]} index={i} title={tier.title} last={i === 2} />
              ))}
            </ol>
          </Caption>
          <Caption progress={progress} range={proof} label={proofCopy.label} heading={proofCopy.heading} body={proofCopy.body} holdEnd>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {storyMedia.proof.project} / admin dashboard
            </p>
          </Caption>
        </div>
      </div>
    </div>
  );
}

function Caption({
  progress,
  range: [a, b],
  label,
  heading,
  body,
  holdEnd,
  children,
}: {
  progress: MotionValue<number>;
  range: StoryRange;
  label: string;
  heading: string;
  body?: string;
  holdEnd?: boolean;
  children?: ReactNode;
}) {
  const inStart = a === 0 ? -1 : a;
  const opacity = useTransform(progress, [inStart, inStart + 0.04, b - 0.04, b], [a === 0 ? 1 : 0, 1, 1, holdEnd ? 1 : 0]);
  const y = useTransform(progress, [inStart, inStart + 0.05], [a === 0 ? 0 : 16, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-5 top-4 sm:inset-x-8">
      <p className="label-mono">{label}</p>
      <h2 className="mt-3 text-balance font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{heading}</h2>
      {body && <p className="mt-3 text-base leading-relaxed text-muted-foreground [@media(max-height:680px)]:hidden">{body}</p>}
      {children}
    </motion.div>
  );
}

function Tier({ progress, range: [a, b], index, title, last }: { progress: MotionValue<number>; range: StoryRange; index: number; title: string; last: boolean }) {
  const lit = useTransform(progress, [a - 0.015, a + 0.015, b - 0.015, b + 0.015], [0, 1, 1, last ? 1 : 0]);
  const opacity = useTransform(lit, [0, 1], [0.78, 1]);
  const bar = useTransform(lit, [0, 1], [0.2, 1]);
  return (
    <motion.li style={{ opacity }} className="flex items-center gap-3">
      <motion.span aria-hidden style={{ scaleY: bar }} className="h-6 w-0.5 shrink-0 rounded-full bg-primary" />
      <span className="text-base font-medium text-foreground">
        <span className="mr-2 font-mono text-sm text-muted-foreground">0{index + 1}</span>
        {title}
      </span>
    </motion.li>
  );
}

function ChapterBar({ progress }: { progress: MotionValue<number> }) {
  const { connect, system, proof } = compactTimeline.chapters;
  return (
    <div aria-hidden className="container-page mt-3 flex gap-1.5">
      {[connect, system, proof].map((range, i) => (
        <Segment key={i} progress={progress} range={range} />
      ))}
    </div>
  );
}

function Segment({ progress, range: [a, b] }: { progress: MotionValue<number>; range: StoryRange }) {
  const fill = useTransform(progress, [a, b], [0, 1]);
  return (
    <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border">
      <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-foreground" />
    </span>
  );
}
