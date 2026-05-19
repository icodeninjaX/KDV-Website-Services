import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/portfolio";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const staticRoutes = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.85 },
  { path: "/estimate", priority: 0.9 },
  { path: "/portfolio", priority: 0.8 },
  { path: "/about", priority: 0.65 },
  { path: "/contact", priority: 0.9 },
  { path: "/privacy", priority: 0.25 },
  { path: "/terms", priority: 0.25 },
] as const;

export function getSitemapRoutes(lastModified = new Date()): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    priority,
  }));

  const serviceEntries = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified,
    priority: 0.8,
  }));

  const caseStudyEntries = portfolio.map((study) => ({
    url: `${site.url}/portfolio/${study.slug}`,
    lastModified,
    priority: 0.75,
  }));

  return [...staticEntries, ...serviceEntries, ...caseStudyEntries];
}
