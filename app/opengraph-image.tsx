import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = "KDV Website Services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.42), transparent 34%), radial-gradient(circle at 86% 72%, rgba(168,85,247,0.34), transparent 32%), #080808",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 3, color: "rgba(255,255,255,0.72)" }}>
          KDV WEBSITE SERVICES
        </div>
        <div>
          <div style={{ maxWidth: 900, fontSize: 82, lineHeight: 0.94, fontWeight: 800 }}>
            Websites, dashboards, and apps for Philippine MSMEs.
          </div>
          <div style={{ marginTop: 32, maxWidth: 720, fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.72)" }}>
            {site.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
