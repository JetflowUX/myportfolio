import type { Metadata } from "next";
import { getSiteContentPayload } from "@/lib/blob-content";

/* Each case study gets its own tab title, description and share card (2026-11-03): the page itself
   is a client component, so the metadata is read here, on the server, from the same admin content. */
export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { projects } = await getSiteContentPayload();
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) return {};
    const title = `${project.homeTitle || project.title} | Jethro Adebisi`;
    const description = (project.homeLine || project.description || "").slice(0, 200);
    const image = project.cover || project.caseStudyImage || project.image;
    return {
      title,
      description,
      openGraph: {
        type: "article",
        url: `/projects/${project.slug}`,
        title,
        description,
        ...(image ? { images: [{ url: image }] } : {}),
      },
      twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
    };
  } catch {
    return {};
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
