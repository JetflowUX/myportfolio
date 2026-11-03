"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { LightboxProvider, useLightbox } from "@/components/image-lightbox";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";
import { projects, type Project } from "@/lib/data";
import { getAllProjects } from "@/lib/project-store";

/* A case study (redesigned 2026-11-03). Jethro: "the case study page looks a little off". The old page
   said everything three or four times (the description, problem, role and outcome each appeared in a
   summary card, a stats bar, the article and a "Full narrative" at the end), laid a dark gradient and a
   caption over the hero image, ran a narrow column beside a sidebar that stopped halfway, and used
   rounded tinted cards and five section colours unlike the rest of the site.

   Now each fact appears once, in the home page's grid: a header with the one-line summary and the link,
   a facts row, the hero image as it is, Problem / Solution / Outcome in three cells, then the story in a
   reading column with a contents list that follows the reader. Every gallery image is shown (the old
   gallery capped at four and captioned them with invented stage names). */

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "context", label: "Context" },
  { id: "process", label: "Process" },
  { id: "research", label: "Research" },
  { id: "design", label: "Design" },
  { id: "screens", label: "Screens" },
  { id: "testing", label: "Testing" },
  { id: "learnings", label: "Learnings" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

/* The project link is not always a live site: a design-only project links to its Figma file. */
function isFigma(url: string) {
  return /(^|\.)figma\.com\//.test(url.replace(/^https?:\/\//, ""));
}

const has = (s?: string) => Boolean(s && s.trim());

export default function ProjectCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => {
    const raw = params?.slug;
    return Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  }, [params]);

  const [allProjects, setAllProjects] = useState<Project[]>(projects);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // wait for the admin content, so an admin-only project never flashes "not found"
    getAllProjects().then((data) => {
      setAllProjects(data);
      setMounted(true);
    });
  }, []);

  const project = allProjects.find((item) => item.slug === slug);

  if (!mounted) {
    return (
      <main className="relative z-10 min-h-screen bg-bg pt-36">
        <TopNav />
        <div className="mx-auto max-w-[1104px] px-6 sm:px-8 lg:px-8 xl:px-0">
          <div className="h-3 w-40 animate-pulse bg-ink/[0.06]" />
          <div className="mt-6 h-14 w-2/3 animate-pulse bg-ink/[0.06]" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="relative z-10 min-h-screen bg-bg pt-36">
        <TopNav />
        <div className="mx-auto max-w-[1104px] px-6 sm:px-8 lg:px-8 xl:px-0">
          <p className="label">Not found</p>
          <h1 className="mt-5 text-[40px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[60px]">
            No case study here.
          </h1>
          <Link href="/work" className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to The Shelf
          </Link>
        </div>
      </main>
    );
  }

  return (
    <LightboxProvider>
      <CaseStudy project={project} allProjects={allProjects} />
    </LightboxProvider>
  );
}

function CaseStudy({ project, allProjects }: { project: Project; allProjects: Project[] }) {
  const { open } = useLightbox();
  const hero = project.caseStudyImage || project.image || project.cover || "";
  const gallery = (project.caseStudyGallery ?? []).filter(Boolean).filter((src) => src !== hero);
  const lead = (project.homeLine || project.description || "").trim();
  // a short write-up is the overview; a long one only repeats the sections below, so it is left out
  const overview = has(project.caseStudy) && project.caseStudy!.trim().length <= 1000 ? project.caseStudy!.trim() : "";
  const palette = extractPalette(project.visualDesign);

  const shown: Record<SectionId, boolean> = {
    overview: has(overview),
    context: has(project.context) || has(project.audience) || has(project.objectives),
    process: has(project.process),
    research: has(project.researchInsights) || has(project.informationArchitecture),
    design: has(project.wireframes) || has(project.visualDesign),
    screens: gallery.length > 0,
    testing: has(project.prototypeTesting),
    learnings: has(project.learnings) || has(project.nextSteps),
  };
  const toc = SECTIONS.filter((s) => shown[s.id]);
  const active = useActiveSection(toc.map((s) => s.id));

  const glance = [
    { k: "The problem", v: project.problem },
    { k: "The solution", v: project.solution },
    { k: "The outcome", v: project.outcomes, accent: true },
  ].filter((c) => has(c.v));

  const facts = [
    { k: "Role", v: project.role },
    { k: "Year", v: project.year },
    { k: "Type", v: project.category === "design" ? "Product design" : "Design and engineering" },
    { k: "Tools", v: (project.tech ?? []).join(", ") },
  ].filter((f) => has(f.v));

  const index = allProjects.findIndex((p) => p.slug === project.slug);
  const next = allProjects.length > 1 ? allProjects[(index + 1) % allProjects.length] : null;
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <main className="relative z-10 min-h-screen bg-bg">
      <ScrollProgress />
      <TopNav />

      <div className="mx-auto max-w-[1104px] px-6 pt-36 sm:px-8 sm:pt-40 lg:px-8 xl:px-0">
        <nav aria-label="Breadcrumb" className="label !text-[10px] flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-text">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/work#case-studies" className="hover:text-text">The Shelf</Link>
        </nav>

        {/* ── header: what it is, in one line, and where to see it ── */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end"
        >
          <div>
            <p className="label">Case study · {project.year}</p>
            <h1
              className={`mt-5 font-black leading-[0.98] tracking-[-0.045em] ${
                project.title.length > 24 ? "text-[34px] sm:text-[48px]" : "text-[40px] sm:text-[64px]"
              }`}
            >
              {project.title}
            </h1>
          </div>
          <div className="max-w-[460px] lg:justify-self-end">
            {lead ? <p className="text-[16px] leading-[1.6] text-text-secondary">{lead}</p> : null}
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 bg-text px-5 text-[13px] font-semibold text-bg transition-opacity hover:opacity-85"
              >
                {isFigma(project.projectLink) ? "View in Figma" : "Open the live site"}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </motion.header>

        {/* ── facts: said once ── */}
        <dl className={`cells mt-12 grid grid-cols-2 ${facts.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {facts.map((f) => (
            <div key={f.k} className="p-5">
              <dt className="label !text-[10px]">{f.k}</dt>
              <dd className="mt-2 text-[14px] font-semibold leading-[1.45] text-text">{f.v}</dd>
            </div>
          ))}
        </dl>

        {/* ── the hero image, as it is: no overlay, nothing written on it ── */}
        {hero ? (
          <button
            type="button"
            onClick={() => open({ src: hero, alt: project.title })}
            aria-label={`Enlarge the ${project.title} image`}
            className="group mt-8 block w-full cursor-zoom-in overflow-hidden border border-border"
            style={{ background: project.coverBg || "rgb(var(--ink-rgb) / 0.03)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero}
              alt={project.title}
              className="mx-auto block h-auto max-h-[78vh] w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />
          </button>
        ) : null}

        {/* ── at a glance: the whole argument before the long read ── */}
        {glance.length ? (
          <div className={`cells mt-8 grid ${glance.length === 3 ? "md:grid-cols-3" : glance.length === 2 ? "md:grid-cols-2" : ""}`}>
            {glance.map((c) => (
              <div key={c.k} className={`p-6 sm:p-7 ${c.accent ? "bg-accent/15" : ""}`}>
                <p className="label !text-[10px]">{c.k}</p>
                <Prose text={c.v!} className="mt-3 !text-[15px] !leading-[1.65] !text-text" />
              </div>
            ))}
          </div>
        ) : null}

        {/* ── the story ── */}
        <div className="mt-20 grid gap-12 sm:mt-24 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="label !text-[10px]">On this page</p>
              <ul className="mt-4 space-y-1 border-l border-border">
                {toc.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block border-l-2 py-1.5 pl-4 text-[14px] transition-colors ${
                        active === s.id
                          ? "border-accent-ink font-semibold text-text"
                          : "border-transparent text-text-tertiary hover:text-text"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link href="/work#case-studies" className="mt-8 inline-flex items-center gap-2 text-[13px] text-text-tertiary hover:text-text">
                <ArrowLeft className="h-3.5 w-3.5" /> The Shelf
              </Link>
            </nav>
          </aside>

          <article className="min-w-0 max-w-[700px]">
            {shown.overview ? (
              <Section id="overview" n={num()} title="Overview">
                <Prose text={overview} />
              </Section>
            ) : null}

            {shown.context ? (
              <Section id="context" n={num()} title="Context">
                <Prose text={project.context ?? ""} />
                <Sub title="Who it's for" text={project.audience} />
                <Sub title="Goals" text={project.objectives} />
              </Section>
            ) : null}

            {shown.process ? (
              <Section id="process" n={num()} title="Process">
                <Prose text={project.process ?? ""} />
              </Section>
            ) : null}

            {shown.research ? (
              <Section id="research" n={num()} title="Research">
                {has(project.researchInsights) ? <Insight label="Key insight" text={project.researchInsights!} /> : null}
                <Sub title="Information architecture" text={project.informationArchitecture} />
              </Section>
            ) : null}

            {shown.design ? (
              <Section id="design" n={num()} title="Design">
                <Sub title="Key screens" text={project.wireframes} first />
                <Sub title="Visual design" text={project.visualDesign} first={!has(project.wireframes)} />
                {palette.length ? (
                  <ul className="mt-6 flex flex-wrap gap-3" aria-label="Colour palette">
                    {palette.map((hex) => (
                      <li key={hex} className="w-[88px]">
                        <span className="block h-14 border border-border" style={{ background: hex }} />
                        <span className="mt-1.5 block text-[12px] tabular-nums text-text-tertiary">{hex}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Section>
            ) : null}

            {shown.screens ? (
              <Section id="screens" n={num()} title="Screens">
                {/* one column, each image at its own shape: mixed shapes in a grid left uneven gaps */}
                <div className="grid gap-4">
                  {gallery.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => open({ src, alt: `${project.title}, image ${i + 1}` })}
                      aria-label={`Enlarge ${project.title} image ${i + 1}`}
                      className="group block cursor-zoom-in overflow-hidden border border-border bg-ink/[0.03]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${project.title}, image ${i + 1}`}
                        loading="lazy"
                        className="mx-auto block h-auto max-h-[80vh] w-auto max-w-full transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                      />
                    </button>
                  ))}
                </div>
              </Section>
            ) : null}

            {shown.testing ? (
              <Section id="testing" n={num()} title="Testing">
                <Prose text={project.prototypeTesting ?? ""} />
              </Section>
            ) : null}

            {shown.learnings ? (
              <Section id="learnings" n={num()} title="Learnings">
                {has(project.learnings) ? <Insight label="What I learned" text={project.learnings!} /> : null}
                <Sub title="What's next" text={project.nextSteps} />
              </Section>
            ) : null}
          </article>
        </div>

        {/* ── next ── */}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group mt-24 flex items-end justify-between gap-6 border-t border-border py-10"
          >
            <span>
              <span className="label !text-[10px]">Next case study</span>
              <span className="mt-3 block text-[28px] font-black leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
                {next.homeTitle || next.title}
              </span>
            </span>
            <ArrowRight className="mb-2 h-7 w-7 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        ) : null}
      </div>

      <SiteFooter variant="compact" />
    </main>
  );
}

/* ── pieces ─────────────────────────────────────────────────────────── */

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border pb-14 pt-8 first:border-t-0 first:pt-0">
      <p className="label !text-[10px] tabular-nums text-accent-ink">{n}</p>
      <h2 className="mt-2 text-[26px] font-bold leading-tight tracking-[-0.02em] sm:text-[30px]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Sub({ title, text, first }: { title: string; text?: string; first?: boolean }) {
  if (!has(text)) return null;
  return (
    <div className={first ? "" : "mt-9"}>
      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-text">{title}</h3>
      <Prose text={text!} className="mt-3" />
    </div>
  );
}

function Insight({ label, text }: { label: string; text: string }) {
  return (
    <figure className="border-l-2 border-accent-ink pl-5 sm:pl-6">
      <figcaption className="label !text-[10px]">{label}</figcaption>
      <Prose text={text} className="mt-3 !text-[17px] !leading-[1.65] !text-text sm:!text-[19px]" />
    </figure>
  );
}

/* Which section the reader is in, for the contents list. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join(",");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/* The colours a project's visual-design note names, in order. Only real ones: no invented fallback. */
function extractPalette(text?: string): string[] {
  if (!text) return [];
  const seen = new Set<string>();
  for (const m of text.matchAll(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) seen.add(m[0].toUpperCase());
  return [...seen].slice(0, 8);
}

/* ── prose: real line breaks are kept, "(1) … (2) …" becomes a list, a wall of text is split ── */

type ProseBlock = { type: "p"; text: string } | { type: "ol"; items: string[] };

function splitProse(raw: string): ProseBlock[] {
  const clean = raw.replace(/\r/g, "").trim();
  if (!clean) return [];
  let blocks = clean.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  if (blocks.length === 1) {
    const lines = clean.split(/\n+/).map((b) => b.trim()).filter(Boolean);
    if (lines.length > 1) blocks = lines;
  }
  const out: ProseBlock[] = [];
  for (const block of blocks) {
    const markers = block.match(/\(\d+\)/g);
    const firstIdx = block.search(/\(\d+\)\s/);
    if (markers && markers.length >= 2 && firstIdx >= 0) {
      const lead = block.slice(0, firstIdx).trim();
      if (lead) out.push({ type: "p", text: lead });
      const items = block
        .slice(firstIdx)
        .split(/(?=\(\d+\)\s)/)
        .map((s) => s.replace(/^\(\d+\)\s*/, "").trim())
        .filter(Boolean);
      out.push({ type: "ol", items });
      continue;
    }
    if (block.length > 300) {
      // a sentinel keeps the space and never breaks decimals like "4.2/5"
      const sentences = block.replace(/([.!?])\s+(?=[A-Z(])/g, "$1|__SENT__|").split("|__SENT__|").filter(Boolean);
      if (sentences.length > 1) {
        for (let i = 0; i < sentences.length; i += 3) out.push({ type: "p", text: sentences.slice(i, i + 3).join(" ").trim() });
        continue;
      }
    }
    out.push({ type: "p", text: block });
  }
  return out;
}

function Prose({ text, className = "" }: { text: string; className?: string }) {
  const blocks = splitProse(text);
  if (!blocks.length) return null;
  return (
    <div className={`space-y-4 text-[16px] leading-[1.75] text-text-secondary sm:text-[17px] ${className}`}>
      {blocks.map((block, i) =>
        block.type === "ol" ? (
          <ol key={i} className="space-y-3">
            {block.items.map((item, j) => (
              <li key={j} className="grid grid-cols-[28px_1fr]">
                <span className="pt-[3px] text-[13px] font-semibold tabular-nums text-accent-ink">{String(j + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p key={i}>{block.text}</p>
        ),
      )}
    </div>
  );
}
