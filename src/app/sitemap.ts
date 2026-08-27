import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/about", priority: 0.8 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    // Every case study, enumerated from content — a new .mdx file appears here
    // with no code change.
    ...getProjectSlugs().map((slug) => ({
      url: `${siteUrl}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
