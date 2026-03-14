# Code Citations

## License: unknown
https://github.com/minhlbh/nguoidung/blob/19ee1fa96267b4ff8fe91bb4fdda3259bd02ede5/src/app/Component/TraCuuBenh/TraCuuBenh.module.ts

```
<parameter name="newString">  const project = allProjects.find((item) => item.slug === slug);

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
            No case study exists for this slug yet. Create one from the admin dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin" className="px-6 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest">
              Go to Admin
            </Link>
            <Link href="/archive" className="px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
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
    { id: "solution", label: "Solution" },
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

      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="pt-28 sm:pt-32 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-gray-600 mb-10 font-mono">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span className="opacity-30">·</span>
          <Link href="/archive" className="hover:text-accent transition-colors">Archive</Link>
          <span className="opacity-30">·</span>
          <span className="text-accent/70">{project.title}</span>
        </div>

        {/* Title block */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-12">
          <motion.p variants={fadeUp} className="text-[10px] text-accent tracking-[0.4em] uppercase mb-4 font-mono">
            UX Case Study — {project.year}
          </motion.p>
          <motion.h1 variants={fadeUp}
            className="text-5xl sm:text-7xl md:text-[clamp(4rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.88] mb-8">
            {project.title}
          </motion.h1>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── HERO IMAGE ────────────────────────────────────────── */}
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-transparent" />

          {/* Bottom-left label */}
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/40 mb-1">
              {project.category} · {project.year}
            </p>
            <p className="text-white/60 text-xs sm:text-sm max-w-sm leading-relaxed">
              {project.solution?.split(" ").slice(0, 14).join(" ")}
              {project.solution && project.solution.split(" ").length > 14 ? "…" : ""}
            </p>
          </div>

          {/* Live site CTA */}
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 bg-accent text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all z-10 flex items-center gap-2"
            >
              Live Site
              <span className="text-[11px]">↗</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-l border-r border-b border-white/[0.07]">
          <StatCell label="Year" value={project.year} />
          <StatCell label="Role" value={project.role} />
          <StatCell label="Category" value={project.category} />
          <StatCell label="Stack" value={project.tech.slice(0, 2).join(" · ")} />
        </div>
      </div>

      {/* ─── MAIN CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mt-20 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14 lg:gap-16 items-start">

          {/* ── ARTICLE ─────────────────────────────────────── */}
          <article className="min-w-0">

            {/* ── Overview ── */}
            <div id="overview" className="mb-1">
              <ChapterDivider number="00" label="Overview" />
              <div className="py-10 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                {project.role && (
                  <div className="mt-6 inline-flex items-center gap-3 border border-white/10 px-5 py-3">
                    <span className="text-[9px] uppercase tracking-[0.32em] text-gray-500 font-mono">Role</span>
                    <span className="text-xs font-bold text-white">{project.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Problem / Solution pair ── */}
            <div id="problem">
              <ChapterDivider number="01" label="Problem & Solution" />
              <div className="py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-0">
                {/* Problem */}
                <div className="bg-white/[0.02] border border-white/[0.07] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-red-400/70 rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-mono">The Problem</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.problem?.trim() ? "text-gray-300" : "text-gray-600 italic"}`}>
                    {project.problem?.trim() || "Document the core user and business problem this project addresses — add it in the admin dashboard."}
                  </p>
                </div>
                {/* Solution */}
                <div id="solution" className="bg-accent/[0.04] border border-accent/[0.18] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-accent/70 font-mono">The Solution</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.solution?.trim() ? "text-gray-200" : "text-gray-600 italic"}`}>
                    {project.solution?.trim() || "Describe the final solution and why it effectively addressed the problem — add it in the admin dashboard."}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Context + Objectives + Audience ── */}
            <div id="context">
              <ChapterDivider number="02" label="Context & Objectives" />
              <NumberedSection sectionId="context-detail" number="02.1" label="Context" body={project.context}
                fallback="Include project timeline, constraints, and operational context. What sparked this project?" />
              <NumberedSection sectionId="objectives" number="02.2" label="Objectives" body={project.objectives}
                fallback="List the measurable UX and business goals. What does success look like?" />
              <NumberedSection sectionId="audience" number="02.3" label="Audience & Users" body={project.audience}
                fallback="Who are the target users? Describe user groups, behaviors, and key demographics." />
            </div>

            {/* ── Process ── */}
            <div id="process">
              <ChapterDivider number="03" label="Design Process" />
              <NumberedSection sectionId="process-detail" number="03" label="How We Got There" body={project.process}
                fallback="Walk through the full design process — from discovery to delivery. What methodology did you apply?" />
            </div>

            {/* ── Research ── */}
            <div id="research">
              <ChapterDivider number="04" label="Research & Insights" />
              {project.researchInsights?.trim() ? (
                <PullQuoteSection sectionId="research-detail" number="04" label="Key Insights" body={project.researchInsights} />
              ) : (
                <NumberedSection sectionId="research-detail" number="04" label="Research Findings"
                  body={project.researchInsights}
                  fallback="What did you learn from user interviews, analytics, or desk research? Surface the most important findings." />
              )}
              <NumberedSection sectionId="ia" number="04.1" label="Information Architecture"
                body={project.informationArchitecture}
                fallback="Document key navigation decisions, content hierarchy, and user flow structures." />
            </div>

            {/* ── Design ── */}
            <div id="design">
              <ChapterDivider number="05" label="Design Execution" />
              <NumberedSection sectionId="wireframes" number="05.1" label="Wireframes & Iterations"
                body={project.wireframes}
                fallback="Describe the lo-fi exploration phase — what layouts were explored, what was discarded, and why." />
              <NumberedSection sectionId="visual-design" number="05.2" label="Visual Design System"
                body={project.visualDesign}
                fallback="Summarize typography, color palette, spacing rules, and component decisions." />
              <NumberedSection sectionId="testing" number="05.3" label="Prototyping & Testing"
                body={project.prototypeTesting}
                fallback="How was the prototype validated? Describe usability sessions, findings, and what changed as a result." />
            </div>

            {/* ── Visual Artifacts Gallery ── */}
            <div id="artifacts">
              <ChapterDivider number="06" label="Visual Artifacts" />
              <VisualGallerySection images={galleryImages} />
            </div>

            {/* ── Outcomes ── */}
            <div id="outcomes">
              <ChapterDivider number="07" label="Impact & Outcomes" />
              <NumberedSection sectionId="outcomes-detail" number="07" label="Results"
                body={project.outcomes}
                fallback="What measurable impact did the project deliver? Include metrics, user feedback, and business outcomes." />
            </div>

            {/* ── Learnings ── */}
            <div id="learnings">
              <ChapterDivider number="08" label="Learnings & Next Steps" />
              {project.learnings?.trim() ? (
                <PullQuoteSection sectionId="learnings-detail" number="08.1" label="Key Learnings" body={project.learnings} />
              ) : (
                <NumberedSection sectionId="learnings-detail" number="08.1" label="Key Learnings"
                  body={project.learnings}
                  fallback="What would you do differently? What surprised you most during this project?" />
              )}
              <NumberedSection sectionId="next-steps" number="08.2" label="Next Steps"
                body={project.nextSteps}
                fallback="Outline the roadmap ahead — follow-up experiments, features to explore, or improvements to pursue." />
            </div>

            {/* ── Full narrative (optional) ── */}
            {project.caseStudy?.trim() && (
              <div>
                <ChapterDivider number="09" label="Full Narrative" />
                <NumberedSection sectionId="narrative" number="09" label="Extended Write-Up"
                  body={project.caseStudy} fallback="" />
              </div>
            )}
          </article>

          {/* ── STICKY SIDEBAR ────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 space-y-5 hidden lg:block">

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

            {/* CTA */}
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-accent text-black px-5 py-4 text-[9px] font-black uppercase tracking-[0.28em] hover:brightness-110 transition-all group"
              >
                Open Live Site
                <span className="text-sm group-hover:translate-x-1 transition-transform">↗</span>
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
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/archive"
              className="flex items-center justify-between border border-white/[0.07] px-5 py-4 text-[9px] font-mono uppercase tracking-[0.28em] text-gray-500 hover:text-accent hover:border-accent/30 transition-colors group"
            >
              <span>← Archive</span>
            </Link>
          </aside>
        </div>
      </div>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-white/[0.05] bg-black/50 backdrop-blur-md relative z-10 mt-24 sm:mt-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black tracking-widest text-accent uppercase">Jethro Adebisi</span>
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tight">
              Handcrafted in Lagos · Built for the Web
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[9px] font-bold tracking-[0.28em] uppercase font-mono">
            <a href="https://x.com/jethroadebisi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">Twitter_X</a>
            <a href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">LinkedIn</a>
            <a href="https://github.com/adebisijethro" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">GitHub</a>
          </div>
          <Link href="/" className="text-[9px] text-gray-700 font-mono hover:text-accent transition-colors tracking-widest uppercase">
            ← Back to Gateway
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────────────────────── */

function Stat
```


## License: unknown
https://github.com/minhlbh/nguoidung/blob/19ee1fa96267b4ff8fe91bb4fdda3259bd02ede5/src/app/Component/TraCuuBenh/TraCuuBenh.module.ts

```
<parameter name="newString">  const project = allProjects.find((item) => item.slug === slug);

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
            No case study exists for this slug yet. Create one from the admin dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin" className="px-6 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest">
              Go to Admin
            </Link>
            <Link href="/archive" className="px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
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
    { id: "solution", label: "Solution" },
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

      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="pt-28 sm:pt-32 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-gray-600 mb-10 font-mono">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span className="opacity-30">·</span>
          <Link href="/archive" className="hover:text-accent transition-colors">Archive</Link>
          <span className="opacity-30">·</span>
          <span className="text-accent/70">{project.title}</span>
        </div>

        {/* Title block */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-12">
          <motion.p variants={fadeUp} className="text-[10px] text-accent tracking-[0.4em] uppercase mb-4 font-mono">
            UX Case Study — {project.year}
          </motion.p>
          <motion.h1 variants={fadeUp}
            className="text-5xl sm:text-7xl md:text-[clamp(4rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.88] mb-8">
            {project.title}
          </motion.h1>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── HERO IMAGE ────────────────────────────────────────── */}
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-transparent" />

          {/* Bottom-left label */}
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/40 mb-1">
              {project.category} · {project.year}
            </p>
            <p className="text-white/60 text-xs sm:text-sm max-w-sm leading-relaxed">
              {project.solution?.split(" ").slice(0, 14).join(" ")}
              {project.solution && project.solution.split(" ").length > 14 ? "…" : ""}
            </p>
          </div>

          {/* Live site CTA */}
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 bg-accent text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all z-10 flex items-center gap-2"
            >
              Live Site
              <span className="text-[11px]">↗</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-l border-r border-b border-white/[0.07]">
          <StatCell label="Year" value={project.year} />
          <StatCell label="Role" value={project.role} />
          <StatCell label="Category" value={project.category} />
          <StatCell label="Stack" value={project.tech.slice(0, 2).join(" · ")} />
        </div>
      </div>

      {/* ─── MAIN CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mt-20 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14 lg:gap-16 items-start">

          {/* ── ARTICLE ─────────────────────────────────────── */}
          <article className="min-w-0">

            {/* ── Overview ── */}
            <div id="overview" className="mb-1">
              <ChapterDivider number="00" label="Overview" />
              <div className="py-10 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                {project.role && (
                  <div className="mt-6 inline-flex items-center gap-3 border border-white/10 px-5 py-3">
                    <span className="text-[9px] uppercase tracking-[0.32em] text-gray-500 font-mono">Role</span>
                    <span className="text-xs font-bold text-white">{project.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Problem / Solution pair ── */}
            <div id="problem">
              <ChapterDivider number="01" label="Problem & Solution" />
              <div className="py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-0">
                {/* Problem */}
                <div className="bg-white/[0.02] border border-white/[0.07] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-red-400/70 rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-mono">The Problem</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.problem?.trim() ? "text-gray-300" : "text-gray-600 italic"}`}>
                    {project.problem?.trim() || "Document the core user and business problem this project addresses — add it in the admin dashboard."}
                  </p>
                </div>
                {/* Solution */}
                <div id="solution" className="bg-accent/[0.04] border border-accent/[0.18] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-accent/70 font-mono">The Solution</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.solution?.trim() ? "text-gray-200" : "text-gray-600 italic"}`}>
                    {project.solution?.trim() || "Describe the final solution and why it effectively addressed the problem — add it in the admin dashboard."}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Context + Objectives + Audience ── */}
            <div id="context">
              <ChapterDivider number="02" label="Context & Objectives" />
              <NumberedSection sectionId="context-detail" number="02.1" label="Context" body={project.context}
                fallback="Include project timeline, constraints, and operational context. What sparked this project?" />
              <NumberedSection sectionId="objectives" number="02.2" label="Objectives" body={project.objectives}
                fallback="List the measurable UX and business goals. What does success look like?" />
              <NumberedSection sectionId="audience" number="02.3" label="Audience & Users" body={project.audience}
                fallback="Who are the target users? Describe user groups, behaviors, and key demographics." />
            </div>

            {/* ── Process ── */}
            <div id="process">
              <ChapterDivider number="03" label="Design Process" />
              <NumberedSection sectionId="process-detail" number="03" label="How We Got There" body={project.process}
                fallback="Walk through the full design process — from discovery to delivery. What methodology did you apply?" />
            </div>

            {/* ── Research ── */}
            <div id="research">
              <ChapterDivider number="04" label="Research & Insights" />
              {project.researchInsights?.trim() ? (
                <PullQuoteSection sectionId="research-detail" number="04" label="Key Insights" body={project.researchInsights} />
              ) : (
                <NumberedSection sectionId="research-detail" number="04" label="Research Findings"
                  body={project.researchInsights}
                  fallback="What did you learn from user interviews, analytics, or desk research? Surface the most important findings." />
              )}
              <NumberedSection sectionId="ia" number="04.1" label="Information Architecture"
                body={project.informationArchitecture}
                fallback="Document key navigation decisions, content hierarchy, and user flow structures." />
            </div>

            {/* ── Design ── */}
            <div id="design">
              <ChapterDivider number="05" label="Design Execution" />
              <NumberedSection sectionId="wireframes" number="05.1" label="Wireframes & Iterations"
                body={project.wireframes}
                fallback="Describe the lo-fi exploration phase — what layouts were explored, what was discarded, and why." />
              <NumberedSection sectionId="visual-design" number="05.2" label="Visual Design System"
                body={project.visualDesign}
                fallback="Summarize typography, color palette, spacing rules, and component decisions." />
              <NumberedSection sectionId="testing" number="05.3" label="Prototyping & Testing"
                body={project.prototypeTesting}
                fallback="How was the prototype validated? Describe usability sessions, findings, and what changed as a result." />
            </div>

            {/* ── Visual Artifacts Gallery ── */}
            <div id="artifacts">
              <ChapterDivider number="06" label="Visual Artifacts" />
              <VisualGallerySection images={galleryImages} />
            </div>

            {/* ── Outcomes ── */}
            <div id="outcomes">
              <ChapterDivider number="07" label="Impact & Outcomes" />
              <NumberedSection sectionId="outcomes-detail" number="07" label="Results"
                body={project.outcomes}
                fallback="What measurable impact did the project deliver? Include metrics, user feedback, and business outcomes." />
            </div>

            {/* ── Learnings ── */}
            <div id="learnings">
              <ChapterDivider number="08" label="Learnings & Next Steps" />
              {project.learnings?.trim() ? (
                <PullQuoteSection sectionId="learnings-detail" number="08.1" label="Key Learnings" body={project.learnings} />
              ) : (
                <NumberedSection sectionId="learnings-detail" number="08.1" label="Key Learnings"
                  body={project.learnings}
                  fallback="What would you do differently? What surprised you most during this project?" />
              )}
              <NumberedSection sectionId="next-steps" number="08.2" label="Next Steps"
                body={project.nextSteps}
                fallback="Outline the roadmap ahead — follow-up experiments, features to explore, or improvements to pursue." />
            </div>

            {/* ── Full narrative (optional) ── */}
            {project.caseStudy?.trim() && (
              <div>
                <ChapterDivider number="09" label="Full Narrative" />
                <NumberedSection sectionId="narrative" number="09" label="Extended Write-Up"
                  body={project.caseStudy} fallback="" />
              </div>
            )}
          </article>

          {/* ── STICKY SIDEBAR ────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 space-y-5 hidden lg:block">

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

            {/* CTA */}
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-accent text-black px-5 py-4 text-[9px] font-black uppercase tracking-[0.28em] hover:brightness-110 transition-all group"
              >
                Open Live Site
                <span className="text-sm group-hover:translate-x-1 transition-transform">↗</span>
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
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/archive"
              className="flex items-center justify-between border border-white/[0.07] px-5 py-4 text-[9px] font-mono uppercase tracking-[0.28em] text-gray-500 hover:text-accent hover:border-accent/30 transition-colors group"
            >
              <span>← Archive</span>
            </Link>
          </aside>
        </div>
      </div>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-white/[0.05] bg-black/50 backdrop-blur-md relative z-10 mt-24 sm:mt-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black tracking-widest text-accent uppercase">Jethro Adebisi</span>
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tight">
              Handcrafted in Lagos · Built for the Web
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[9px] font-bold tracking-[0.28em] uppercase font-mono">
            <a href="https://x.com/jethroadebisi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">Twitter_X</a>
            <a href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">LinkedIn</a>
            <a href="https://github.com/adebisijethro" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">GitHub</a>
          </div>
          <Link href="/" className="text-[9px] text-gray-700 font-mono hover:text-accent transition-colors tracking-widest uppercase">
            ← Back to Gateway
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────────────────────── */

function Stat
```


## License: unknown
https://github.com/minhlbh/nguoidung/blob/19ee1fa96267b4ff8fe91bb4fdda3259bd02ede5/src/app/Component/TraCuuBenh/TraCuuBenh.module.ts

```
<parameter name="newString">  const project = allProjects.find((item) => item.slug === slug);

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
            No case study exists for this slug yet. Create one from the admin dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin" className="px-6 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest">
              Go to Admin
            </Link>
            <Link href="/archive" className="px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
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
    { id: "solution", label: "Solution" },
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

      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="pt-28 sm:pt-32 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-gray-600 mb-10 font-mono">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span className="opacity-30">·</span>
          <Link href="/archive" className="hover:text-accent transition-colors">Archive</Link>
          <span className="opacity-30">·</span>
          <span className="text-accent/70">{project.title}</span>
        </div>

        {/* Title block */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-12">
          <motion.p variants={fadeUp} className="text-[10px] text-accent tracking-[0.4em] uppercase mb-4 font-mono">
            UX Case Study — {project.year}
          </motion.p>
          <motion.h1 variants={fadeUp}
            className="text-5xl sm:text-7xl md:text-[clamp(4rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.88] mb-8">
            {project.title}
          </motion.h1>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── HERO IMAGE ────────────────────────────────────────── */}
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-transparent" />

          {/* Bottom-left label */}
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/40 mb-1">
              {project.category} · {project.year}
            </p>
            <p className="text-white/60 text-xs sm:text-sm max-w-sm leading-relaxed">
              {project.solution?.split(" ").slice(0, 14).join(" ")}
              {project.solution && project.solution.split(" ").length > 14 ? "…" : ""}
            </p>
          </div>

          {/* Live site CTA */}
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 bg-accent text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all z-10 flex items-center gap-2"
            >
              Live Site
              <span className="text-[11px]">↗</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-l border-r border-b border-white/[0.07]">
          <StatCell label="Year" value={project.year} />
          <StatCell label="Role" value={project.role} />
          <StatCell label="Category" value={project.category} />
          <StatCell label="Stack" value={project.tech.slice(0, 2).join(" · ")} />
        </div>
      </div>

      {/* ─── MAIN CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mt-20 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14 lg:gap-16 items-start">

          {/* ── ARTICLE ─────────────────────────────────────── */}
          <article className="min-w-0">

            {/* ── Overview ── */}
            <div id="overview" className="mb-1">
              <ChapterDivider number="00" label="Overview" />
              <div className="py-10 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                {project.role && (
                  <div className="mt-6 inline-flex items-center gap-3 border border-white/10 px-5 py-3">
                    <span className="text-[9px] uppercase tracking-[0.32em] text-gray-500 font-mono">Role</span>
                    <span className="text-xs font-bold text-white">{project.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Problem / Solution pair ── */}
            <div id="problem">
              <ChapterDivider number="01" label="Problem & Solution" />
              <div className="py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-0">
                {/* Problem */}
                <div className="bg-white/[0.02] border border-white/[0.07] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-red-400/70 rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-mono">The Problem</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.problem?.trim() ? "text-gray-300" : "text-gray-600 italic"}`}>
                    {project.problem?.trim() || "Document the core user and business problem this project addresses — add it in the admin dashboard."}
                  </p>
                </div>
                {/* Solution */}
                <div id="solution" className="bg-accent/[0.04] border border-accent/[0.18] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-accent/70 font-mono">The Solution</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.solution?.trim() ? "text-gray-200" : "text-gray-600 italic"}`}>
                    {project.solution?.trim() || "Describe the final solution and why it effectively addressed the problem — add it in the admin dashboard."}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Context + Objectives + Audience ── */}
            <div id="context">
              <ChapterDivider number="02" label="Context & Objectives" />
              <NumberedSection sectionId="context-detail" number="02.1" label="Context" body={project.context}
                fallback="Include project timeline, constraints, and operational context. What sparked this project?" />
              <NumberedSection sectionId="objectives" number="02.2" label="Objectives" body={project.objectives}
                fallback="List the measurable UX and business goals. What does success look like?" />
              <NumberedSection sectionId="audience" number="02.3" label="Audience & Users" body={project.audience}
                fallback="Who are the target users? Describe user groups, behaviors, and key demographics." />
            </div>

            {/* ── Process ── */}
            <div id="process">
              <ChapterDivider number="03" label="Design Process" />
              <NumberedSection sectionId="process-detail" number="03" label="How We Got There" body={project.process}
                fallback="Walk through the full design process — from discovery to delivery. What methodology did you apply?" />
            </div>

            {/* ── Research ── */}
            <div id="research">
              <ChapterDivider number="04" label="Research & Insights" />
              {project.researchInsights?.trim() ? (
                <PullQuoteSection sectionId="research-detail" number="04" label="Key Insights" body={project.researchInsights} />
              ) : (
                <NumberedSection sectionId="research-detail" number="04" label="Research Findings"
                  body={project.researchInsights}
                  fallback="What did you learn from user interviews, analytics, or desk research? Surface the most important findings." />
              )}
              <NumberedSection sectionId="ia" number="04.1" label="Information Architecture"
                body={project.informationArchitecture}
                fallback="Document key navigation decisions, content hierarchy, and user flow structures." />
            </div>

            {/* ── Design ── */}
            <div id="design">
              <ChapterDivider number="05" label="Design Execution" />
              <NumberedSection sectionId="wireframes" number="05.1" label="Wireframes & Iterations"
                body={project.wireframes}
                fallback="Describe the lo-fi exploration phase — what layouts were explored, what was discarded, and why." />
              <NumberedSection sectionId="visual-design" number="05.2" label="Visual Design System"
                body={project.visualDesign}
                fallback="Summarize typography, color palette, spacing rules, and component decisions." />
              <NumberedSection sectionId="testing" number="05.3" label="Prototyping & Testing"
                body={project.prototypeTesting}
                fallback="How was the prototype validated? Describe usability sessions, findings, and what changed as a result." />
            </div>

            {/* ── Visual Artifacts Gallery ── */}
            <div id="artifacts">
              <ChapterDivider number="06" label="Visual Artifacts" />
              <VisualGallerySection images={galleryImages} />
            </div>

            {/* ── Outcomes ── */}
            <div id="outcomes">
              <ChapterDivider number="07" label="Impact & Outcomes" />
              <NumberedSection sectionId="outcomes-detail" number="07" label="Results"
                body={project.outcomes}
                fallback="What measurable impact did the project deliver? Include metrics, user feedback, and business outcomes." />
            </div>

            {/* ── Learnings ── */}
            <div id="learnings">
              <ChapterDivider number="08" label="Learnings & Next Steps" />
              {project.learnings?.trim() ? (
                <PullQuoteSection sectionId="learnings-detail" number="08.1" label="Key Learnings" body={project.learnings} />
              ) : (
                <NumberedSection sectionId="learnings-detail" number="08.1" label="Key Learnings"
                  body={project.learnings}
                  fallback="What would you do differently? What surprised you most during this project?" />
              )}
              <NumberedSection sectionId="next-steps" number="08.2" label="Next Steps"
                body={project.nextSteps}
                fallback="Outline the roadmap ahead — follow-up experiments, features to explore, or improvements to pursue." />
            </div>

            {/* ── Full narrative (optional) ── */}
            {project.caseStudy?.trim() && (
              <div>
                <ChapterDivider number="09" label="Full Narrative" />
                <NumberedSection sectionId="narrative" number="09" label="Extended Write-Up"
                  body={project.caseStudy} fallback="" />
              </div>
            )}
          </article>

          {/* ── STICKY SIDEBAR ────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 space-y-5 hidden lg:block">

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

            {/* CTA */}
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-accent text-black px-5 py-4 text-[9px] font-black uppercase tracking-[0.28em] hover:brightness-110 transition-all group"
              >
                Open Live Site
                <span className="text-sm group-hover:translate-x-1 transition-transform">↗</span>
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
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/archive"
              className="flex items-center justify-between border border-white/[0.07] px-5 py-4 text-[9px] font-mono uppercase tracking-[0.28em] text-gray-500 hover:text-accent hover:border-accent/30 transition-colors group"
            >
              <span>← Archive</span>
            </Link>
          </aside>
        </div>
      </div>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-white/[0.05] bg-black/50 backdrop-blur-md relative z-10 mt-24 sm:mt-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black tracking-widest text-accent uppercase">Jethro Adebisi</span>
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tight">
              Handcrafted in Lagos · Built for the Web
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[9px] font-bold tracking-[0.28em] uppercase font-mono">
            <a href="https://x.com/jethroadebisi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">Twitter_X</a>
            <a href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">LinkedIn</a>
            <a href="https://github.com/adebisijethro" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">GitHub</a>
          </div>
          <Link href="/" className="text-[9px] text-gray-700 font-mono hover:text-accent transition-colors tracking-widest uppercase">
            ← Back to Gateway
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────────────────────── */

function Stat
```


## License: unknown
https://github.com/minhlbh/nguoidung/blob/19ee1fa96267b4ff8fe91bb4fdda3259bd02ede5/src/app/Component/TraCuuBenh/TraCuuBenh.module.ts

```
<parameter name="newString">  const project = allProjects.find((item) => item.slug === slug);

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
            No case study exists for this slug yet. Create one from the admin dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin" className="px-6 py-3 bg-accent text-black text-[10px] font-black uppercase tracking-widest">
              Go to Admin
            </Link>
            <Link href="/archive" className="px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors">
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
    { id: "solution", label: "Solution" },
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

      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="pt-28 sm:pt-32 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-gray-600 mb-10 font-mono">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span className="opacity-30">·</span>
          <Link href="/archive" className="hover:text-accent transition-colors">Archive</Link>
          <span className="opacity-30">·</span>
          <span className="text-accent/70">{project.title}</span>
        </div>

        {/* Title block */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-12">
          <motion.p variants={fadeUp} className="text-[10px] text-accent tracking-[0.4em] uppercase mb-4 font-mono">
            UX Case Study — {project.year}
          </motion.p>
          <motion.h1 variants={fadeUp}
            className="text-5xl sm:text-7xl md:text-[clamp(4rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.88] mb-8">
            {project.title}
          </motion.h1>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── HERO IMAGE ────────────────────────────────────────── */}
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-transparent" />

          {/* Bottom-left label */}
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-white/40 mb-1">
              {project.category} · {project.year}
            </p>
            <p className="text-white/60 text-xs sm:text-sm max-w-sm leading-relaxed">
              {project.solution?.split(" ").slice(0, 14).join(" ")}
              {project.solution && project.solution.split(" ").length > 14 ? "…" : ""}
            </p>
          </div>

          {/* Live site CTA */}
          {project.projectLink && (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 bg-accent text-black px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] hover:brightness-110 transition-all z-10 flex items-center gap-2"
            >
              Live Site
              <span className="text-[11px]">↗</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* ─── STATS BAR ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-l border-r border-b border-white/[0.07]">
          <StatCell label="Year" value={project.year} />
          <StatCell label="Role" value={project.role} />
          <StatCell label="Category" value={project.category} />
          <StatCell label="Stack" value={project.tech.slice(0, 2).join(" · ")} />
        </div>
      </div>

      {/* ─── MAIN CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto mt-20 sm:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14 lg:gap-16 items-start">

          {/* ── ARTICLE ─────────────────────────────────────── */}
          <article className="min-w-0">

            {/* ── Overview ── */}
            <div id="overview" className="mb-1">
              <ChapterDivider number="00" label="Overview" />
              <div className="py-10 sm:py-12">
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                {project.role && (
                  <div className="mt-6 inline-flex items-center gap-3 border border-white/10 px-5 py-3">
                    <span className="text-[9px] uppercase tracking-[0.32em] text-gray-500 font-mono">Role</span>
                    <span className="text-xs font-bold text-white">{project.role}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Problem / Solution pair ── */}
            <div id="problem">
              <ChapterDivider number="01" label="Problem & Solution" />
              <div className="py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-0">
                {/* Problem */}
                <div className="bg-white/[0.02] border border-white/[0.07] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-red-400/70 rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 font-mono">The Problem</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.problem?.trim() ? "text-gray-300" : "text-gray-600 italic"}`}>
                    {project.problem?.trim() || "Document the core user and business problem this project addresses — add it in the admin dashboard."}
                  </p>
                </div>
                {/* Solution */}
                <div id="solution" className="bg-accent/[0.04] border border-accent/[0.18] p-7 sm:p-9">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-accent/70 font-mono">The Solution</span>
                  </div>
                  <p className={`leading-relaxed text-sm sm:text-base whitespace-pre-wrap ${project.solution?.trim() ? "text-gray-200" : "text-gray-600 italic"}`}>
                    {project.solution?.trim() || "Describe the final solution and why it effectively addressed the problem — add it in the admin dashboard."}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Context + Objectives + Audience ── */}
            <div id="context">
              <ChapterDivider number="02" label="Context & Objectives" />
              <NumberedSection sectionId="context-detail" number="02.1" label="Context" body={project.context}
                fallback="Include project timeline, constraints, and operational context. What sparked this project?" />
              <NumberedSection sectionId="objectives" number="02.2" label="Objectives" body={project.objectives}
                fallback="List the measurable UX and business goals. What does success look like?" />
              <NumberedSection sectionId="audience" number="02.3" label="Audience & Users" body={project.audience}
                fallback="Who are the target users? Describe user groups, behaviors, and key demographics." />
            </div>

            {/* ── Process ── */}
            <div id="process">
              <ChapterDivider number="03" label="Design Process" />
              <NumberedSection sectionId="process-detail" number="03" label="How We Got There" body={project.process}
                fallback="Walk through the full design process — from discovery to delivery. What methodology did you apply?" />
            </div>

            {/* ── Research ── */}
            <div id="research">
              <ChapterDivider number="04" label="Research & Insights" />
              {project.researchInsights?.trim() ? (
                <PullQuoteSection sectionId="research-detail" number="04" label="Key Insights" body={project.researchInsights} />
              ) : (
                <NumberedSection sectionId="research-detail" number="04" label="Research Findings"
                  body={project.researchInsights}
                  fallback="What did you learn from user interviews, analytics, or desk research? Surface the most important findings." />
              )}
              <NumberedSection sectionId="ia" number="04.1" label="Information Architecture"
                body={project.informationArchitecture}
                fallback="Document key navigation decisions, content hierarchy, and user flow structures." />
            </div>

            {/* ── Design ── */}
            <div id="design">
              <ChapterDivider number="05" label="Design Execution" />
              <NumberedSection sectionId="wireframes" number="05.1" label="Wireframes & Iterations"
                body={project.wireframes}
                fallback="Describe the lo-fi exploration phase — what layouts were explored, what was discarded, and why." />
              <NumberedSection sectionId="visual-design" number="05.2" label="Visual Design System"
                body={project.visualDesign}
                fallback="Summarize typography, color palette, spacing rules, and component decisions." />
              <NumberedSection sectionId="testing" number="05.3" label="Prototyping & Testing"
                body={project.prototypeTesting}
                fallback="How was the prototype validated? Describe usability sessions, findings, and what changed as a result." />
            </div>

            {/* ── Visual Artifacts Gallery ── */}
            <div id="artifacts">
              <ChapterDivider number="06" label="Visual Artifacts" />
              <VisualGallerySection images={galleryImages} />
            </div>

            {/* ── Outcomes ── */}
            <div id="outcomes">
              <ChapterDivider number="07" label="Impact & Outcomes" />
              <NumberedSection sectionId="outcomes-detail" number="07" label="Results"
                body={project.outcomes}
                fallback="What measurable impact did the project deliver? Include metrics, user feedback, and business outcomes." />
            </div>

            {/* ── Learnings ── */}
            <div id="learnings">
              <ChapterDivider number="08" label="Learnings & Next Steps" />
              {project.learnings?.trim() ? (
                <PullQuoteSection sectionId="learnings-detail" number="08.1" label="Key Learnings" body={project.learnings} />
              ) : (
                <NumberedSection sectionId="learnings-detail" number="08.1" label="Key Learnings"
                  body={project.learnings}
                  fallback="What would you do differently? What surprised you most during this project?" />
              )}
              <NumberedSection sectionId="next-steps" number="08.2" label="Next Steps"
                body={project.nextSteps}
                fallback="Outline the roadmap ahead — follow-up experiments, features to explore, or improvements to pursue." />
            </div>

            {/* ── Full narrative (optional) ── */}
            {project.caseStudy?.trim() && (
              <div>
                <ChapterDivider number="09" label="Full Narrative" />
                <NumberedSection sectionId="narrative" number="09" label="Extended Write-Up"
                  body={project.caseStudy} fallback="" />
              </div>
            )}
          </article>

          {/* ── STICKY SIDEBAR ────────────────────────────── */}
          <aside className="lg:sticky lg:top-28 space-y-5 hidden lg:block">

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

            {/* CTA */}
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-accent text-black px-5 py-4 text-[9px] font-black uppercase tracking-[0.28em] hover:brightness-110 transition-all group"
              >
                Open Live Site
                <span className="text-sm group-hover:translate-x-1 transition-transform">↗</span>
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
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/archive"
              className="flex items-center justify-between border border-white/[0.07] px-5 py-4 text-[9px] font-mono uppercase tracking-[0.28em] text-gray-500 hover:text-accent hover:border-accent/30 transition-colors group"
            >
              <span>← Archive</span>
            </Link>
          </aside>
        </div>
      </div>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-white/[0.05] bg-black/50 backdrop-blur-md relative z-10 mt-24 sm:mt-28">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black tracking-widest text-accent uppercase">Jethro Adebisi</span>
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-tight">
              Handcrafted in Lagos · Built for the Web
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[9px] font-bold tracking-[0.28em] uppercase font-mono">
            <a href="https://x.com/jethroadebisi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">Twitter_X</a>
            <a href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">LinkedIn</a>
            <a href="https://github.com/adebisijethro" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent transition-colors">GitHub</a>
          </div>
          <Link href="/" className="text-[9px] text-gray-700 font-mono hover:text-accent transition-colors tracking-widest uppercase">
            ← Back to Gateway
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────────────────────────── */

function Stat
```

