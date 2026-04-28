"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SHOW_AFTER_MS = 80;
const FADE_OUT_MS = 200;

function isInternalLinkClick(e: MouseEvent): HTMLAnchorElement | null {
  if (e.defaultPrevented) return null;
  if (e.button !== 0) return null;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const target = e.target as HTMLElement | null;
  const a = target?.closest("a");
  if (!a) return null;
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download")) return null;
  const href = a.getAttribute("href");
  if (!href) return null;
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  try {
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname) return null;
  } catch {
    return null;
  }
  return a;
}

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const start = () => {
      if (activeRef.current) return;
      activeRef.current = true;
      startTimerRef.current = setTimeout(() => {
        setVisible(true);
        setProgress(0.12);
        trickleRef.current = setInterval(() => {
          setProgress((p) => (p < 0.9 ? p + (1 - p) * 0.08 : p));
        }, 220);
      }, SHOW_AFTER_MS);
    };

    const onClick = (e: MouseEvent) => {
      if (!isInternalLinkClick(e)) return;
      start();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!activeRef.current) return;
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    if (trickleRef.current) clearInterval(trickleRef.current);
    setProgress(1);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      activeRef.current = false;
    }, FADE_OUT_MS);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_OUT_MS}ms ease-out` }}
    >
      <div
        className="h-full origin-left bg-gradient-brand"
        style={{
          transform: `scaleX(${progress})`,
          transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
