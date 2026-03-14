"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CursorFollower } from "@/components/cursor-follower";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";
import { projects, type Project } from "@/lib/data";
import { getAllProjects } from "@/lib/project-store";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = { show: { transition: { staggerChildren: 0.09 } } };

export default function ProjectCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => {
    const raw = params?.slug;
    if (Array.isArray(raw)) return raw[0] ?? "";
    return raw ?? "";
  }, [params]);

  const [allProjects, setAllProjects] = useState<Project[]>(projects);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAllProjects(getAllProjects());
    setMounted(true);
  }, []);

  const project = allProjects.find((item) => item.slug === slug);

  const caseStudyImage =
    project?.caseStudyImage ||
    project?.image ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200";
  const galleryImages = project?.caseStudyGallery ?? [];

  if (!mounted) {
    return (
      <main className="relative z-10 pt-28">
        <TopNav />
        <div className="mx-auto max-w-4xl mt-20 px-6 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-500 mb-6 font-mono">
            Loading Case Study
          </p>
          <div className="h-1 w-24 mx-auto bg-accent/30 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="relative z-10 pt-28">
        <TopNav />
        <div className="mx-auto max-w-4xl bento-card p-10 text-center mt-20 mx-6">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gray-500 mb-4 font-mono">
            404 — Not Found
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tight">
            Project Not Found
          </h1>
          <p className="text-gray-500 mb-10 text-sm">
            No case study exists for this slug yet. Create one from the admin
            dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/admin"
              className="px-6 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest"
            >
              Go to Admin
            </Link>
            <Link
              href="/archive"
              className="px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors"
            >
              Open Archive
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "context", label: "Context" },
    { id: "process", label: "Process" },
    { id: "research", label: "Research" },
    { id: "design", label: "Design" },
    { id: "artifacts", label: "Artifacts" },
    { id: "outcomes", label: "Outcomes" },
    { id: "learnings", label: "Learnings" },
  ];

  return (
    <main className="relative z-10 min-h-screen bg-[#050505]">
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <div className="pt-28 sm:pt-32 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.22em] sm:tracking-[0.3em] text-gray-600 mb-8 sm:mb-10 font-mono">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span className="opacity-30">·</span>
          <Link href="/archive" className="hover:text-accent transition-colors">
            Archive
          </Link>
          <span className="opacity-30">·</span>
          <span className="text-accent/70 break-words">{project.title}</span>
        </div>

        {/* Title block */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="text-[10px] text-accent tracking-[0.4em] uppercase mb-4 font-mono"
          >
            UX Case Study — {project.year}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl min-[420px]:text-5xl sm:text-7xl md:text-[clamp(4rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.88] mb-8 break-words"
          >
            {project.title}
          </motion.h1>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10"
          >
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── HERO IMAGE ─────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mb-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative overflow-hidden"
          style={{ aspectRatio: "21/9" }}
        >
          <img
            src={caseStudyImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-transparent" />

          {/* bottom-left caption */}
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/40 mb-1">
              {project.category} · {project.year}
            </p>
            <p className="text-white/60 text-xs sm:text-sm max-w-sm leading-relaxed">
              {project.solution
                ? project.solution.split(" ").slice(0, 14).join(" ") +
                  (project.solution.split(" ").length > 14 ? "…" : "")
                : ""}
            </p>
          </div>

          {/* Live CTA */}
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex absolute top-7 right-7 bg-accent text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all z-10 items-center gap-2"
            >
              Live Site <span className="text-[11px]">↗</span>
            </a>
          )}
        </motion.div>
        {project.projectLink && (
          <a
            href={project.projectLink}
            target="_blank"
            rel="noreferrer"
            className="sm:hidden mt-3 inline-flex items-center justify-center gap-2 bg-accent text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.22em] w-full"
          >
            Open Live Site <span className="text-[11px]">↗</span>
          </a>
        )}
      </div>

      {/* ─── STATS BAR ──────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-l border-r border-b border-white/[0.07]">
          <StatCell label="Year" value={project.year} />
          <StatCell label="Role" value={project.role} />
          <StatCell label="Category" value={project.category} />
          <StatCell
            label="Stack"
            value={project.tech.slice(0, 2).join(" · ")}
          />
        </div>
      </div>

      {/* ─── MAIN CONTENT + SIDEBAR ─────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mt-20 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14 lg:gap-16 items-start">
          {/* ── ARTICLE ─────────────────────────────── */}
          <article className="min-w-0">
            {/* 00 Overview */}
            <div id="overview">
              <ChapterDivider number="00" label="Overview" />
              <div className="py-10 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                {project.role && (
                  <div className="mt-6 inline-flex items-center gap-3 border border-white/10 px-5 py-3">
                    <span className="text-[9px] uppercase tracking-[0.32em] text-gray-500 font-mono">
                      Role
                    </span>
                    <span className="text-xs font-bold text-white">
                      {project.role}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 01 Problem / Solution */}
            <div id="problem">
              <ChapterDivider number="01" label="Problem & Solution" />
              <div className="py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-0">
                <div className="bg-white/[0.02] border border-white/[0.07] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-red-400/70 rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-mono">
                      The Problem
                    </span>
                  </div>
                  <p
                    className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.problem?.trim() ? "text-gray-300" : "text-gray-600 italic"}`}
                  >
                    {project.problem?.trim() ||
                      "Document the core user and business problem this project addresses — add it in the admin dashboard."}
                  </p>
                </div>
                <div className="bg-accent/[0.04] border border-accent/[0.18] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-accent/70 font-mono">
                      The Solution
                    </span>
                  </div>
                  <p
                    className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.solution?.trim() ? "text-gray-200" : "text-gray-600 italic"}`}
                  >
                    {project.solution?.trim() ||
                      "Describe the final solution and why it effectively addressed the problem — add it in the admin dashboard."}
                  </p>
                </div>
              </div>
            </div>

            {/* 02 Context */}
            <div id="context">
              <ChapterDivider number="02" label="Context & Objectives" />
              <NumberedSection
                number="02.1"
                label="Context"
                body={project.context}
                fallback="Include project timeline, constraints, and operational context. What sparked this project?"
              />
              <NumberedSection
                number="02.2"
                label="Objectives"
                body={project.objectives}
                fallback="List the measurable UX and business goals. What does success look like?"
              />
              <NumberedSection
                number="02.3"
                label="Audience & Users"
                body={project.audience}
                fallback="Who are the target users? Describe user groups, behaviors, and key demographics."
              />
            </div>

            {/* 03 Process */}
            <div id="process">
              <ChapterDivider number="03" label="Design Process" />
              <NumberedSection
                number="03"
                label="How We Got There"
                body={project.process}
                fallback="Walk through the full design process — from discovery to delivery. What methodology did you apply?"
              />
            </div>

            {/* 04 Research */}
            <div id="research">
              <ChapterDivider number="04" label="Research & Insights" />
              {project.researchInsights?.trim() ? (
                <PullQuoteSection
                  number="04"
                  label="Key Insights"
                  body={project.researchInsights}
                />
              ) : (
                <NumberedSection
                  number="04"
                  label="Research Findings"
                  body={project.researchInsights}
                  fallback="What did you learn from user interviews, analytics, or desk research? Surface the most important findings."
                />
              )}
              <NumberedSection
                number="04.1"
                label="Information Architecture"
                body={project.informationArchitecture}
                fallback="Document key navigation decisions, content hierarchy, and user flow structures."
              />
            </div>

            {/* 05 Design */}
            <div id="design">
              <ChapterDivider number="05" label="Design Execution" />
              <NumberedSection
                number="05.1"
                label="Wireframes & Iterations"
                body={project.wireframes}
                fallback="Describe the lo-fi exploration phase — what layouts were explored, what was discarded, and why."
              />
              <NumberedSection
                number="05.2"
                label="Visual Design System"
                body={project.visualDesign}
                fallback="Summarize typography, color palette, spacing rules, and component decisions."
              />
              <NumberedSection
                number="05.3"
                label="Prototyping & Testing"
                body={project.prototypeTesting}
                fallback="How was the prototype validated? Describe usability sessions, findings, and what changed as a result."
              />
            </div>

            {/* 06 Visual Artifacts */}
            <div id="artifacts">
              <ChapterDivider number="06" label="Visual Artifacts" />
              <VisualGallerySection images={galleryImages} />
            </div>

            {/* 07 Outcomes */}
            <div id="outcomes">
              <ChapterDivider number="07" label="Impact & Outcomes" />
              <NumberedSection
                number="07"
                label="Results"
                body={project.outcomes}
                fallback="What measurable impact did the project deliver? Include metrics, user feedback, and business outcomes."
              />
            </div>

            {/* 08 Learnings */}
            <div id="learnings">
              <ChapterDivider number="08" label="Learnings & Next Steps" />
              {project.learnings?.trim() ? (
                <PullQuoteSection
                  number="08.1"
                  label="Key Learnings"
                  body={project.learnings}
                />
              ) : (
                <NumberedSection
                  number="08.1"
                  label="Key Learnings"
                  body={project.learnings}
                  fallback="What would you do differently? What surprised you most during this project?"
                />
              )}
              <NumberedSection
                number="08.2"
                label="Next Steps"
                body={project.nextSteps}
                fallback="Outline the roadmap ahead — follow-up experiments, features to explore, or improvements to pursue."
              />
            </div>

            {/* 09 Full narrative (optional) */}
            {project.caseStudy?.trim() && (
              <div>
                <ChapterDivider number="09" label="Full Narrative" />
                <NumberedSection
                  number="09"
                  label="Extended Write-Up"
                  body={project.caseStudy}
                  fallback=""
                />
              </div>
            )}
          </article>

          {/* ── STICKY SIDEBAR ──────────────────────── */}
          <aside className="lg:sticky lg:top-28 space-y-4 hidden lg:block">
            {/* TOC */}
            <nav className="border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-[9px] uppercase tracking-[0.35em] text-gray-600 mb-4 font-mono">
                Contents
              </p>
              <ul className="space-y-0.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-3 py-1.5 px-2 text-[10px] text-gray-500 hover:text-accent transition-colors tracking-widest uppercase font-mono group"
                    >
                      <span className="w-3 h-px bg-white/10 group-hover:bg-accent/50 transition-colors" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Live CTA */}
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-accent text-black px-5 py-4 text-[9px] font-black uppercase tracking-[0.28em] hover:brightness-110 transition-all group"
              >
                Open Live Site
                <span className="text-sm group-hover:translate-x-1 transition-transform">
                  ↗
                </span>
              </a>
            ) : (
              <div className="border border-white/[0.07] px-5 py-4 text-center">
                <p className="text-[9px] text-gray-600 uppercase tracking-[0.28em] font-mono">
                  Live site not linked
                </p>
              </div>
            )}

            {/* Tech stack */}
            <div className="border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-[9px] uppercase tracking-[0.35em] text-gray-600 mb-3 font-mono">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Back */}
            <Link
              href="/archive"
              className="flex items-center border border-white/[0.07] px-5 py-4 text-[9px] font-mono uppercase tracking-[0.28em] text-gray-500 hover:text-accent hover:border-accent/30 transition-colors"
            >
              ← Archive
            </Link>
          </aside>
        </div>
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-white/[0.05] bg-black/50 backdrop-blur-md relative z-10 mt-24 sm:mt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black tracking-widest text-accent uppercase">
              Jethro Adebisi
            </span>
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tight">
              Handcrafted in Lagos · Built for the Web
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[9px] font-bold tracking-[0.16em] sm:tracking-[0.28em] uppercase font-mono">
            <a
              href="https://x.com/jethroadebisi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              Twitter_X
            </a>
            <a
              href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/adebisijethro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              GitHub
            </a>
          </div>
          <Link
            href="/"
            className="text-[9px] text-gray-700 font-mono hover:text-accent transition-colors tracking-widest uppercase"
          >
            ← Back to Gateway
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ── HELPER COMPONENTS ──────────────────────────────────────── */

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 sm:p-7 border-r border-b border-white/[0.07] last:border-r-0">
      <p className="text-[8px] uppercase tracking-[0.35em] text-gray-600 mb-1.5 font-mono">
        {label}
      </p>
      <p className="text-xs sm:text-sm font-bold text-white capitalize leading-tight">
        {value}
      </p>
    </div>
  );
}

function ChapterDivider({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-center gap-4 pt-16 sm:pt-20 pb-1"
    >
      <span className="text-[9px] font-mono text-gray-600 tracking-widest tabular-nums">
        {number}
      </span>
      <div className="h-px flex-1 bg-white/[0.06]" />
      <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-gray-500">
        {label}
      </span>
    </motion.div>
  );
}

function NumberedSection({
  number,
  label,
  body,
  fallback,
}: {
  number: string;
  label: string;
  body?: string;
  fallback: string;
}) {
  const text = body?.trim();
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-6 sm:gap-10 py-8 sm:py-10 border-b border-white/[0.05]"
    >
      <div className="shrink-0 w-10 sm:w-14 pt-0.5">
        <span className="text-3xl sm:text-4xl font-black leading-none font-mono select-none text-white/[0.035]">
          {number.replace(".", "")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] uppercase tracking-[0.35em] text-gray-500 mb-3 font-mono font-bold">
          {label}
        </p>
        <p
          className={`leading-[1.8] whitespace-pre-wrap text-sm ${text ? "text-gray-300" : "text-gray-600 italic"}`}
        >
          {text || fallback}
        </p>
      </div>
    </motion.section>
  );
}

function PullQuoteSection({
  number,
  label,
  body,
}: {
  number: string;
  label: string;
  body: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-6 sm:gap-10 py-8 sm:py-10 border-b border-white/[0.05]"
    >
      <div className="shrink-0 w-10 sm:w-14 pt-0.5">
        <span className="text-3xl sm:text-4xl font-black leading-none font-mono select-none text-white/[0.035]">
          {number.replace(".", "")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] uppercase tracking-[0.35em] text-gray-500 mb-5 font-mono font-bold">
          {label}
        </p>
        <blockquote className="relative pl-5 sm:pl-7">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-accent/50 to-transparent" />
          <p className="text-sm sm:text-base text-gray-200 leading-[1.85] italic whitespace-pre-wrap">
            {body}
          </p>
        </blockquote>
      </div>
    </motion.section>
  );
}

const SLOT_LABELS = [
  "Discovery & Research",
  "Information Architecture",
  "Wireframes & Iterations",
  "Final UI & Prototype",
];

function VisualGallerySection({ images }: { images: string[] }) {
  const hasAny = images.some(Boolean);
  return (
    <div className="py-8 sm:py-10">
      {!hasAny && (
        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-mono mb-6">
          Upload project screenshots via the admin dashboard to populate this
          section.
        </p>
      )}
      <VisualSlot image={images[0]} label={SLOT_LABELS[0]} tall />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-3">
        <VisualSlot image={images[1]} label={SLOT_LABELS[1]} />
        <VisualSlot image={images[2]} label={SLOT_LABELS[2]} />
        <VisualSlot image={images[3]} label={SLOT_LABELS[3]} />
      </div>
    </div>
  );
}

function VisualSlot({
  image,
  label,
  tall,
}: {
  image?: string;
  label: string;
  tall?: boolean;
}) {
  const h = tall ? "h-56 sm:h-72 lg:h-80" : "h-36 sm:h-44";
  if (image) {
    return (
      <motion.figure
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden border border-white/[0.07] group"
      >
        <div className={`${h} overflow-hidden`}>
          <img
            src={image}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <figcaption className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.07] bg-white/[0.02]">
          <span className="text-[8px] uppercase tracking-[0.28em] text-gray-500 font-mono">
            {label}
          </span>
          <span className="text-[8px] text-gray-700 font-mono">↑</span>
        </figcaption>
      </motion.figure>
    );
  }
  return (
    <div
      className={`${h} border border-dashed border-white/[0.1] bg-white/[0.01] flex flex-col items-center justify-center gap-2`}
    >
      <div className="w-6 h-6 border border-dashed border-accent/25 flex items-center justify-center">
        <span className="text-accent/30 text-sm leading-none">+</span>
      </div>
      <p className="text-[8px] text-gray-700 uppercase tracking-[0.22em] font-mono text-center px-4">
        {label}
      </p>
    </div>
  );
}
