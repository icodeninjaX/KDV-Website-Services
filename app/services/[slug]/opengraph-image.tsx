import { ImageResponse } from "next/og";
import { getService } from "@/lib/services";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

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
            "radial-gradient(circle at 16% 18%, rgba(99,102,241,0.44), transparent 32%), radial-gradient(circle at 88% 80%, rgba(168,85,247,0.32), transparent 34%), #080808",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.68)" }}>
          KDV SERVICE
        </div>
        <div>
          <div style={{ maxWidth: 920, fontSize: 88, lineHeight: 0.94, fontWeight: 800 }}>
            {service?.title ?? "KDV Website Services"}
          </div>
          <div style={{ marginTop: 32, maxWidth: 760, fontSize: 30, lineHeight: 1.35, color: "rgba(255,255,255,0.74)" }}>
            {service?.summary ?? "Websites, dashboards, and custom web apps for Philippine MSMEs."}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
