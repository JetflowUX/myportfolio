import type { MetadataRoute } from "next";
import { getSiteContentPayload } from "@/lib/blob-content";
import { projects as staticProjects } from "@/lib/data";

// Every public page, case studies included, read from the admin content (2026-11-03).
export const revalidate = 3600;
const BASE = "https://jethrotheuxpert.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs = staticProjects.map((p) => p.slug);
  try {
    slugs = (await getSiteContentPayload()).projects.map((p) => p.slug);
  } catch {}
  return [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/work`, priority: 0.8 },
    { url: `${BASE}/playground`, priority: 0.5 },
    { url: `${BASE}/contact`, priority: 0.7 },
    ...slugs.map((slug) => ({ url: `${BASE}/projects/${slug}`, priority: 0.8 })),
  ];
}
