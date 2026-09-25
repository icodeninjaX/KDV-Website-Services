"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { storyMedia, storyTimeline } from "@/lib/story";
import type { SystemScene } from "./system-scene";

function supportsWebGL() {
  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      probe.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    const ok = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/**
 * Hosts the real-time system scene. Loads three.js on demand, renders only while
 * the stage is on screen, the tab is visible, and no video layer is covering it.
 */
export function StoryScene({
  progress,
  videoCovers,
  onFail,
}: {
  progress: MotionValue<number>;
  videoCovers: boolean;
  onFail: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoCoversRef = useRef(videoCovers);
  const onFailRef = useRef(onFail);
  const updateRef = useRef<() => void>(() => {});
  videoCoversRef.current = videoCovers;
  onFailRef.current = onFail;

  useEffect(() => {
    updateRef.current();
  }, [videoCovers]);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    let scene: SystemScene | null = null;
    let cancelled = false;
    let inView = false;
    const [videoStart, videoEnd] = storyTimeline.videoRange;
    // Without a generated poster, the scene itself is the opening frame.
    const sceneStart = storyMedia.stills.scattered ? storyTimeline.sceneStart : 0;

    const fail = () => {
      if (cancelled) return;
      cancelled = true;
      scene?.dispose();
      scene = null;
      onFailRef.current();
    };

    const update = () => {
      if (!scene) return;
      const p = progress.get();
      scene.setProgress(p);
      const occluded = videoCoversRef.current && p > videoStart + 0.04 && p < videoEnd - 0.04;
      scene.setActive(inView && document.visibilityState === "visible" && p >= sceneStart && !occluded);
    };
    updateRef.current = update;

    if (!supportsWebGL()) {
      fail();
      return;
    }

    import("./system-scene")
      .then(({ createSystemScene }) => {
        if (cancelled) return;
        scene = createSystemScene({
          canvas,
          proofSrc: storyMedia.proof.src,
          proofAspect: storyMedia.proof.width / storyMedia.proof.height,
          tierRanges: storyTimeline.tierRanges,
          onContextLost: fail,
        });
        const rect = wrap.getBoundingClientRect();
        scene.resize(rect.width, rect.height);
        update();
        canvas.style.opacity = "1";
      })
      .catch(fail);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    io.observe(wrap);
    const ro = new ResizeObserver(([entry]) => {
      scene?.resize(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(wrap);
    const unsubscribe = progress.on("change", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      unsubscribe();
      document.removeEventListener("visibilitychange", update);
      scene?.dispose();
      scene = null;
      updateRef.current = () => {};
    };
  }, [progress]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full opacity-0 transition-opacity duration-700" />
    </div>
  );
}
