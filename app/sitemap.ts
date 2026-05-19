import type { MetadataRoute } from "next";
import { getSitemapRoutes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapRoutes();
}
