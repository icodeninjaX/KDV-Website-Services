"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
    };
  }
}

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

const HIDDEN_ROUTES = ["/contact"];
const LOAD_DELAY_MS = 8000;

function isHidden(pathname: string) {
  return HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}

export function TawkChat() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const [shouldLoad, setShouldLoad] = useState(false);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.Tawk_API = window.Tawk_API ?? {};
    const previousOnLoad = window.Tawk_API.onLoad;
    const syncVisibility = () => {
      annotateTawkFrames();
      if (isHidden(pathnameRef.current) || document.body.dataset.galleryOpen === "true") {
        window.Tawk_API?.hideWidget?.();
      } else {
        window.Tawk_API?.showWidget?.();
      }
    };
    const onLoad = () => {
      previousOnLoad?.();
      syncVisibility();
    };
    window.Tawk_API.onLoad = onLoad;
    window.addEventListener("kdv:gallerychange", syncVisibility);
    syncVisibility();
    return () => {
      window.removeEventListener("kdv:gallerychange", syncVisibility);
      if (window.Tawk_API?.onLoad === onLoad) window.Tawk_API.onLoad = previousOnLoad;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isHidden(pathname)) return;

    const load = () => setShouldLoad(true);
    const timer = window.setTimeout(load, LOAD_DELAY_MS);
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown"];

    for (const event of events) {
      window.addEventListener(event, load, { once: true, passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const event of events) {
        window.removeEventListener(event, load);
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Tawk_API?.hideWidget) return;
    annotateTawkFrames();
    if (isHidden(pathname) || document.body.dataset.galleryOpen === "true") {
      window.Tawk_API.hideWidget();
    } else {
      window.Tawk_API.showWidget?.();
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !shouldLoad) return;
    annotateTawkFrames();
    const observer = new MutationObserver(annotateTawkFrames);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [shouldLoad]);

  if (!PROPERTY_ID || !shouldLoad || isHidden(pathname)) return null;

  return (
    <Script
      id="tawk-chat"
      strategy="lazyOnload"
      src={`https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`}
      crossOrigin="anonymous"
    />
  );
}

function annotateTawkFrames() {
  for (const frame of document.querySelectorAll<HTMLIFrameElement>("iframe")) {
    if (!frame.title && frame.src === "about:blank") {
      frame.title = "KDV live chat";
    }
  }
}
