"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { projects } from "@/lib/data";
import { getAllProjects } from "@/lib/project-store";
import { CursorFollower } from "@/components/cursor-follower";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";

type Filter = "all" | "engineering" | "design";

export default function ArchivePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [allProjects, setAllProjects] = useState(projects);

  useEffect(() => {
    setAllProjects(getAllProjects());
  }, []);

  const visible = allProjects.filter(
    (p) => filter === "all" || p.category === filter,
  );

  return (
    <main className="relative z-10 pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 flex flex-col min-h-screen">
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      {/* ── Header ─────────────────────────────────────── */}
      <header className="max-w-[1400px] mx-auto w-full mb-14 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 mb-6 text-[10px] text-accent tracking-[0.2em] sm:tracking-[0.4em] uppercase">
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
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-sm ml-auto">
              A systematic collection of digital artifacts, ranging from
              high-fidelity interfaces to complex engineering systems. Built
              with precision and intent.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between border-y border-white/5 py-4 sm:py-6 gap-4 sm:gap-6">
          <div className="flex flex-wrap gap-4 sm:gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
            {(["all", "engineering", "design"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`transition-colors ${filter === f ? "text-accent filter-btn-active" : "text-gray-500 hover:text-white"}`}
              >
                {f === "all"
                  ? "All_Systems"
                  : f === "engineering"
                    ? "Engineering"
                    : "UI/UX_Design"}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-gray-600 font-mono">
            TOTAL_ENTRIES:{" "}
            <span className="text-white">
              {String(visible.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </header>

      {/* ── Project Grid ────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project, idx) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className={`bento-card hyper-border group ${idx === 3 ? "lg:col-span-2" : ""}`}
            >
              {/* Scanline */}
              <div className="scanline" />

              {/* Image */}
              <div className="h-56 sm:h-72 overflow-hidden relative archive-image-mask">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[8px] uppercase tracking-widest text-accent">
                  [ {project.category} ]
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-[9px] text-accent font-mono border border-accent/30 px-2 py-0.5 bg-accent/10">
                    {project.year}
                  </span>
                  {project.tech.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] text-gray-500 font-mono border border-white/5 px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-accent transition-colors uppercase">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    View Artifact
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
                  <span className="text-[10px] text-gray-700 font-mono">
                    0{idx + 1}_
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Quote Block ─────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto w-full mt-20 sm:mt-40">
        <div className="bento-card p-6 sm:p-12 bg-white/[0.01] border-dashed border-white/10 text-center">
          <div className="max-w-xl mx-auto">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
              Experimental_Zone
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 italic">
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

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="py-10 sm:py-12 px-4 sm:px-6 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10 mt-16 sm:mt-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold tracking-widest text-accent">
              JETHRO ADEBISI
            </span>
            <span className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">
              Handcrafted in Lagos / Built for the Web
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-[10px] font-bold tracking-widest uppercase">
            <a
              href="https://x.com/jethroadebisi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Twitter_X
            </a>
            <a
              href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/adebisijethro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
          <Link
            href="/"
            className="text-[10px] text-gray-700 font-mono hover:text-accent transition-colors"
          >
            ← Back to Gateway
          </Link>
        </div>
      </footer>
    </main>
  );
}

function RotateBox() {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`w-16 h-16 border flex items-center justify-center transition-all duration-500 ${active ? "border-accent rotate-90 scale-110" : "border-white/10"}`}
    >
      <span
        className={`text-xl transition-colors ${active ? "text-accent" : "text-gray-700"}`}
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
      className="w-16 h-16 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-accent group transition-all"
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
    <div className="w-16 h-16 border border-white/10 flex items-center justify-center cursor-pointer hover:border-accent animate-pulse transition-colors">
      <div className="w-4 h-4 bg-accent rounded-full" />
    </div>
  );
}
