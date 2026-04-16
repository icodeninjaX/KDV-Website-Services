import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { portfolio } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/portfolio", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
  }));
  const serviceRoutes = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
  }));
  const caseRoutes = portfolio.map((c) => ({
    url: `${site.url}/portfolio/${c.slug}`,
    lastModified: now,
  }));
  return [...staticRoutes, ...serviceRoutes, ...caseRoutes];
}
