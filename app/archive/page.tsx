"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";
import { getAllProjects } from "@/lib/project-store";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";

/* All projects, in the home page's grid (2026-11-03). The old page spoke in a different voice
   ("Status: Browsing_Repository", "PROJECTS. ARCHIVE_01", "TOTAL_ENTRIES") from the calm grid the
   rest of the site now uses; this is the same hairline cells, labels and type as the home page. */

type Filter = "all" | "design" | "engineering";
const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["design", "Design"],
  ["engineering", "Engineering"],
];

export default function ArchivePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [allProjects, setAllProjects] = useState(projects);

  useEffect(() => {
    getAllProjects().then(setAllProjects);
  }, []);

  const visible = allProjects.filter((p) => filter === "all" || p.category === filter);

  return (
    <>
      <ScrollProgress />
      <TopNav />
      <main id="main-content" className="mx-auto max-w-[1104px] px-6 pb-28 pt-36 sm:px-8 sm:pt-40 lg:px-8 xl:px-0">
        <header className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="label">All projects</p>
            <h1 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.045em] sm:text-[64px]">
              Case studies and builds.
            </h1>
          </div>
          <p className="max-w-[440px] text-[15px] leading-[1.6] text-text-secondary lg:justify-self-end">
            Product design from research to tested prototype, and front-end work built in React and Next.js. Each one
            opens to its full case study.
          </p>
        </header>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-border py-3">
          <div className="-mx-2 flex flex-wrap">
            {FILTERS.map(([f, label]) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-[44px] px-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors sm:px-3 ${
                  filter === f ? "text-text underline decoration-2 underline-offset-[6px]" : "text-text-tertiary hover:text-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-text-tertiary">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        </div>

        <section className="cells mt-10 grid md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-ink/[0.03]">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="label !text-[10px]">
                  {project.category === "design" ? "Design" : "Engineering"} · {project.year}
                </p>
                <h2 className="mt-3 text-[20px] font-bold leading-tight tracking-[-0.02em]">{project.title}</h2>
                <p className="mt-2 line-clamp-3 text-[14px] leading-[1.55] text-text-secondary">{project.description}</p>
                {project.tech?.length ? (
                  <p className="mt-4 text-[12px] text-text-tertiary">{project.tech.slice(0, 3).join(" · ")}</p>
                ) : null}
                <span className="label mt-auto inline-flex items-center gap-2 pt-5 transition-colors group-hover:text-text">
                  Read the case study <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter variant="compact" />
    </>
  );
}
