"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projects } from "@/lib/data";
import { getAllProjects } from "@/lib/project-store";
import { CursorFollower } from "@/components/cursor-follower";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";

type Filter = "all" | "engineering" | "design";

// Static, literal Tailwind class strings — kept as complete tokens (not
// interpolated) so the JIT compiler can actually find and generate them.
const ENGINEERING_CAT = {
  badgeText: "text-accent",
  chipText: "text-accent-ink",
  chipBorder: "border border-accent/30",
  chipBg: "bg-accent/10",
  titleHover: "group-hover:text-accent-ink",
  linkHover: "hover:text-accent-ink",
};
const DESIGN_CAT = {
  badgeText: "text-accent-cold",
  chipText: "text-accent-cold-ink",
  chipBorder: "border border-accent-cold/30",
  chipBg: "bg-accent-cold/10",
  titleHover: "group-hover:text-accent-cold-ink",
  linkHover: "hover:text-accent-cold-ink",
};

export default function ArchivePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [allProjects, setAllProjects] = useState(projects);

  useEffect(() => {
    getAllProjects().then(setAllProjects);
  }, []);

  const visible = allProjects.filter(
    (p) => filter === "all" || p.category === filter,
  );

  return (
    <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 flex flex-col min-h-screen">
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      {/* ── Header ─────────────────────────────────────── */}
      <header className="max-w-[1400px] mx-auto w-full mb-14 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 mb-6 text-[10px] text-accent-ink tracking-[0.2em] sm:tracking-[0.4em] uppercase">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Status: Browsing_Repository
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6 break-words">
              PROJ<span className="gradient-text">ECTS.</span>
              <br />
              ARCHIVE_01
            </h1>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="font-sans text-text-secondary text-xs md:text-sm leading-relaxed max-w-sm ml-auto">
              A systematic collection of digital artifacts, ranging from
              high-fidelity interfaces to complex engineering systems. Built
              with precision and intent.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between border-y border-ink/5 py-4 sm:py-6 gap-4 sm:gap-6">
          <div className="flex flex-wrap gap-4 sm:gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
            {(["all", "engineering", "design"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`transition-colors ${filter === f ? "filter-btn-active" : "text-text-tertiary hover:text-text"}`}
              >
                {f === "all"
                  ? "All_Systems"
                  : f === "engineering"
                    ? "Engineering"
                    : "UI/UX_Design"}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-text-tertiary font-mono">
            TOTAL_ENTRIES:{" "}
            <span className="text-text">
              {String(visible.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </header>

      {/* ── Project Grid ────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project, idx) => {
            const cat = project.category === "design" ? DESIGN_CAT : ENGINEERING_CAT;
            return (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className={`bento-card hyper-border group ${idx === 3 ? "lg:col-span-2" : ""}`}
            >
              {/* Image */}
              <div className="h-56 sm:h-72 overflow-hidden relative archive-image-mask">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div
                  className={`absolute top-6 left-6 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[8px] uppercase tracking-widest ${cat.badgeText}`}
                >
                  [ {project.category} ]
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 ${cat.chipText} ${cat.chipBorder} ${cat.chipBg}`}
                  >
                    {project.year}
                  </span>
                  {(project.tech ?? []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] text-text-tertiary font-mono border border-ink/5 px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className={`text-xl font-bold mb-3 tracking-tight transition-colors uppercase ${cat.titleHover}`}
                >
                  {project.title}
                </h3>
                <p className="font-sans text-text-secondary text-xs leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-ink/5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${cat.linkHover}`}
                  >
                    View Case Study
                    <svg
                      className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <span className="text-[10px] text-text-tertiary font-mono">
                    0{idx + 1}_
                  </span>
                </div>
              </div>
            </motion.article>
            );
          })}
        </div>
      </section>

      {/* ── Quote Block ─────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto w-full mt-20 sm:mt-40">
        <div className="bento-card p-6 sm:p-12 bg-ink/[0.01] border-dashed border-ink/10 text-center">
          <div className="max-w-xl mx-auto">
            <span className="text-accent-ink text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
              Experimental_Zone
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold mb-6 italic">
              &ldquo;Design is a function of logic, refined by empathy.&rdquo;
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <RotateBox />
              <CounterBox />
              <PulseBox />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter variant="compact" />
    </main>
  );
}

function RotateBox() {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`w-16 h-16 border flex items-center justify-center transition-all duration-500 ${active ? "border-accent rotate-90 scale-110" : "border-ink/10"}`}
    >
      <span
        className={`text-xl transition-colors ${active ? "text-accent-ink" : "text-text-tertiary"}`}
      >
        ∫
      </span>
    </div>
  );
}

function CounterBox() {
  const [count, setCount] = useState(0);
  return (
    <div
      onClick={() => setCount((c) => c + 1)}
      className="w-16 h-16 border border-ink/10 flex flex-col items-center justify-center cursor-pointer hover:bg-accent group transition-all"
    >
      <span className="text-[8px] group-hover:text-black transition-colors">
        INC_
      </span>
      <span className="text-xs font-bold group-hover:text-black transition-colors">
        {count}
      </span>
    </div>
  );
}

function PulseBox() {
  return (
    <div className="w-16 h-16 border border-ink/10 flex items-center justify-center cursor-pointer hover:border-accent animate-pulse transition-colors">
      <div className="w-4 h-4 bg-accent rounded-full" />
    </div>
  );
}
