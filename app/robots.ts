import type { MetadataRoute } from "next";

// Search engines may read the site, not the admin (2026-11-03).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/login2admin", "/api/"] },
    sitemap: "https://jethrotheuxpert.vercel.app/sitemap.xml",
  };
}
