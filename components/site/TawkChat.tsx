"use client";

import { useEffect, useRef } from "react";
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

function isHidden(pathname: string) {
  return HIDDEN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}

export function TawkChat() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.Tawk_API = window.Tawk_API ?? {};
    window.Tawk_API.onLoad = () => {
      if (isHidden(pathnameRef.current)) {
        window.Tawk_API?.hideWidget?.();
      } else {
        window.Tawk_API?.showWidget?.();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Tawk_API?.hideWidget) return;
    if (isHidden(pathname)) {
      window.Tawk_API.hideWidget();
    } else {
      window.Tawk_API.showWidget?.();
    }
  }, [pathname]);

  if (!PROPERTY_ID) return null;

  return (
    <Script
      id="tawk-chat"
      strategy="lazyOnload"
      src={`https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`}
      crossOrigin="anonymous"
    />
  );
}
