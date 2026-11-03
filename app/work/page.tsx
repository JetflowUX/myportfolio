"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { projects, type MotionPiece } from "@/lib/data";
import { allFilms, lightboxItem } from "@/lib/films";
import { getAllProjects } from "@/lib/project-store";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { LightboxProvider, useLightbox } from "@/components/image-lightbox";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";

/* The Shelf (2026-11-03). Jethro: "when you click on works, take them to the archive page ...
   rename the archive page ... not archive ... add the videos also to that page. So they can have
   three tabs, design, engineering, videos". Everything he has made, in one place: the projects
   (admin-managed, as the archive was) and the films, each opening where it plays on the home page.
   /archive redirects here (next.config.mjs). ?tab=films opens a tab directly. */

type Tab = "all" | "design" | "engineering" | "films";

function ShelfPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [allProjects, setAllProjects] = useState(projects);
  const films = allFilms();

  useEffect(() => {
    getAllProjects().then(setAllProjects);
    const fromUrl = new URLSearchParams(window.location.search).get("tab");
    if (fromUrl === "design" || fromUrl === "engineering" || fromUrl === "films") setTab(fromUrl);
  }, []);

  function choose(next: Tab) {
    setTab(next);
    const url = next === "all" ? "/work" : `/work?tab=${next}`;
    window.history.replaceState(null, "", url);
  }

  const design = allProjects.filter((p) => p.category === "design");
  const engineering = allProjects.filter((p) => p.category === "engineering");
  const tabs: [Tab, string, number][] = [
    ["all", "All", allProjects.length + films.length],
    ["design", "Design", design.length],
    ["engineering", "Engineering", engineering.length],
    ["films", "Films", films.length],
  ];
  const shownProjects = tab === "design" ? design : tab === "engineering" ? engineering : tab === "all" ? allProjects : [];
  const showFilms = tab === "all" || tab === "films";

  return (
    <>
      <ScrollProgress />
      <TopNav />
      <main id="main-content" className="mx-auto max-w-[1104px] px-6 pb-28 pt-36 sm:px-8 sm:pt-40 lg:px-8 xl:px-0">
        <header className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="label">The Shelf</p>
            <h1 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.045em] sm:text-[64px]">
              Everything, designed, built and filmed.
            </h1>
          </div>
          <p className="max-w-[440px] text-[15px] leading-[1.6] text-text-secondary lg:justify-self-end">
            Product design from research to tested prototype, front-end work in React and Next.js, and the launch
            films and explainers that show them. Pick a shelf, or take it all in.
          </p>
        </header>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-border py-3">
          <div className="-mx-2 flex flex-wrap" role="tablist" aria-label="Filter the shelf">
            {tabs.map(([k, label, count]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                onClick={() => choose(k)}
                className={`min-h-[44px] px-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors sm:px-3 ${
                  tab === k ? "text-text underline decoration-2 underline-offset-[6px]" : "text-text-tertiary hover:text-text"
                }`}
              >
                {label} <span className="ml-0.5 font-medium text-text-tertiary">{count}</span>
              </button>
            ))}
          </div>
          <p className="text-[12px] text-text-tertiary">
            {tab === "films"
              ? "Click a film to watch it with sound"
              : tab === "all"
                ? "Case studies first, then films"
                : `${shownProjects.length} ${shownProjects.length === 1 ? "project" : "projects"}`}
          </p>
        </div>

        {shownProjects.length ? (
          <section aria-label="Projects" className="mt-10">
            {tab === "all" ? <h2 className="label mb-5">Case studies</h2> : null}
            <div className="cells grid md:grid-cols-2 lg:grid-cols-3">
              {shownProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-ink/[0.03]">
                    {project.cover || project.image ? (
                      <Image
                        src={project.cover || project.image}
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
                    <h3 className="mt-3 text-[20px] font-bold leading-tight tracking-[-0.02em]">{project.title}</h3>
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
            </div>
          </section>
        ) : null}

        {showFilms ? (
          <section aria-label="Films" className={tab === "all" ? "mt-20" : "mt-10"}>
            {tab === "all" ? <h2 className="label mb-5">Films</h2> : null}
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {films.map((film) => (
                <FilmCard key={film.slug} film={film} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter variant="compact" />
    </>
  );
}

/* A film: its poster, its 4 s loop on hover where there is one, and a click to watch with sound. */
function FilmCard({ film }: { film: MotionPiece }) {
  const { open } = useLightbox();
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !film.loop) return;
    if (on) {
      if (!v.src) v.src = film.loop;
      void v.play().catch(() => {});
    } else v.pause();
  }, [on, film.loop]);

  return (
    <button
      type="button"
      onClick={() => open(lightboxItem(film))}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      aria-label={`Watch ${film.title}`}
      className="group block text-left"
    >
      <div className="relative aspect-video overflow-hidden bg-ink/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={film.poster}
          alt=""
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${on && film.loop ? "opacity-0" : ""}`}
        />
        {film.loop ? <video ref={ref} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" /> : null}
        <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
      </div>
      <p className="mt-3 text-[15px] font-semibold leading-snug tracking-[-0.01em] group-hover:underline">{film.title}</p>
      <p className="mt-1 text-[12px] text-text-tertiary">{film.meta}</p>
    </button>
  );
}

export default function WorkPage() {
  return (
    <LightboxProvider>
      <ShelfPage />
    </LightboxProvider>
  );
}
