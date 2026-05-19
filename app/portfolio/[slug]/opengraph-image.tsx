import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/lib/portfolio";
import { site } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const background = study?.cover
    ? `linear-gradient(90deg, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.84) 48%, rgba(8,8,8,0.45) 100%), url(${site.url}${study.cover.src})`
    : "radial-gradient(circle at 14% 18%, rgba(99,102,241,0.42), transparent 34%), radial-gradient(circle at 86% 78%, rgba(168,85,247,0.34), transparent 34%), #080808";

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
          backgroundImage: background,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.68)" }}>
          <span>KDV CASE STUDY</span>
          <span>{study?.year ?? ""}</span>
        </div>
        <div>
          <div style={{ maxWidth: 900, fontSize: 86, lineHeight: 0.94, fontWeight: 800 }}>
            {study?.title ?? "Selected Work"}
          </div>
          <div style={{ marginTop: 28, maxWidth: 820, fontSize: 32, lineHeight: 1.25, color: "rgba(255,255,255,0.78)" }}>
            {study?.outcome ?? "Websites, dashboards, and custom web apps built for real clients."}
          </div>
          <div style={{ marginTop: 34, fontSize: 24, color: "rgba(255,255,255,0.58)" }}>
            {study?.client ?? "KDV Website Services"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
