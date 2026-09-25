"use client";

import { useEffect, useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { StoryRange } from "@/lib/story";

/**
 * Maps scroll progress onto video time. The element never plays, so there is no
 * competing playback clock; seeks are coalesced to the latest target while the
 * decoder is busy. The source is attached from JS so non-cinematic visitors never
 * download it.
 */
export function ScrubVideo({
  progress,
  range,
  src,
  type,
  onReady,
  onFail,
}: {
  progress: MotionValue<number>;
  range: StoryRange;
  src: string;
  type: string;
  onReady: () => void;
  onFail: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [start, end] = range;
  const opacity = useTransform(progress, [start - 0.03, start + 0.01, end - 0.04, end], [0, 1, 1, 0]);

  useEffect(() => {
    const video = ref.current!;
    let duration = 0;
    let pending: number | null = null;

    const flush = () => {
      if (pending === null || !duration || video.seeking) return;
      const t = pending;
      pending = null;
      if (Math.abs(video.currentTime - t) > 1 / 120) video.currentTime = t;
    };
    const queue = (p: number) => {
      if (!duration) return;
      const u = Math.min(1, Math.max(0, (p - start) / (end - start)));
      // Stay a hair inside the last frame; seeking to exactly `duration` is unreliable.
      pending = Math.min(duration - 0.05, Math.max(0, u * duration));
      flush();
    };
    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      queue(progress.get());
    };
    const onData = () => onReady();
    const onError = () => onFail();

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("loadeddata", onData);
    video.addEventListener("seeked", flush);
    video.addEventListener("error", onError);
    const unsubscribe = progress.on("change", queue);

    const source = document.createElement("source");
    source.src = src;
    source.type = type;
    source.addEventListener("error", onError);
    video.appendChild(source);
    video.load();

    return () => {
      unsubscribe();
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", onData);
      video.removeEventListener("seeked", flush);
      video.removeEventListener("error", onError);
      source.removeEventListener("error", onError);
      source.remove();
      video.load();
    };
  }, [progress, src, type, start, end, onReady, onFail]);

  return (
    <motion.video
      ref={ref}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden
      tabIndex={-1}
      style={{ opacity }}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
