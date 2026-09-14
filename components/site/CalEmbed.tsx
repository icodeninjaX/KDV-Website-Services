"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "15min" });
      const brand = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()})`;
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": brand }, dark: { "cal-brand": brand } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })().catch(() => { /* The direct booking link remains available if the embed cannot load. */ });
  }, []);

  return (
    <div className="w-full min-w-0">
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        Choose a time below, or{" "}
        <a href="https://cal.com/kdvwebservices/15min" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">open the booking calendar in a new tab</a>.
      </p>
      <Cal namespace="15min" calLink="kdvwebservices/15min" style={{ width: "100%", height: "100%", minHeight: "640px", overflow: "auto" }} config={{ layout: "month_view", theme: "dark" }} />
    </div>
  );
}
