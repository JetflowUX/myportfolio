"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CursorFollower } from "@/components/cursor-follower";
import { ProjectCard } from "@/components/project-card";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SpatialCanvas } from "@/components/spatial-canvas";
import { TopNav } from "@/components/top-nav";
import { companies, projects, type Company, type Project } from "@/lib/data";
import { getAllCompanies, getAllProjects } from "@/lib/project-store";

export default function HomePage() {
  // Seed with the static lists (matches the server render exactly), then
  // upgrade to the live admin-edited data — fetched from Vercel Blob via
  // /api/admin/content — once mounted. Seeding useState directly from an
  // async fetch isn't possible anyway, and this also keeps the server
  // render and the client's first render identical, avoiding a hydration
  // mismatch. archive/page.tsx and the case-study page use the same
  // seed-then-upgrade pattern.
  const [allProjects, setAllProjects] = useState<Project[]>(projects);
  const [allCompanies, setAllCompanies] = useState<Company[]>(companies);

  useEffect(() => {
    getAllProjects().then(setAllProjects);
    getAllCompanies().then(setAllCompanies);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Display first 4 projects in 2-column staggered layout like the reference
  const featured = allProjects.slice(0, 4);
  const sectionTransition = {
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage("✓ Message sent! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "", website: "" });
        setTimeout(() => setSubmitMessage(""), 7000);
      } else {
        setSubmitMessage("✗ Failed to send. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitMessage("✗ Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6"
      id="main-content"
    >
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      {/* ── HERO (The Gateway) ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={sectionTransition}
        className="max-w-7xl mx-auto mb-20 sm:mb-32"
      >
        <div className="grid grid-cols-12 gap-4">
          {/* Main header card — the one focal point: headline + a single
              primary CTA. Everything else in the hero is a secondary layer
              the eye finds on its second pass, not competing with this. */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-8 bento-card hyper-border p-6 sm:p-10 flex flex-col justify-between min-h-[420px] sm:min-h-[500px]"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/30 text-accent-ink text-[10px] uppercase tracking-[0.2em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Available for new projects
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight break-words">
                Front-End Engineer crafting{" "}
                <span className="gradient-text">thoughtful</span> digital
                experiences.
              </h1>
            </div>

            <div className="max-w-xl">
              <p className="font-sans text-text-secondary text-sm md:text-base leading-relaxed mb-8">
                Mathematics student turned UX Engineer. I bridge the gap between
                abstract logic and human centered design through high
                performance web interfaces.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="#work"
                  className="aqua-surface px-6 sm:px-8 py-4 text-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all duration-300 text-center w-full sm:w-auto inline-flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(0,255,194,0.18)]"
                >
                  View Projects
                  <svg
                    className="w-4 h-4"
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
                </a>
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-1.5 w-full sm:w-auto border border-border px-6 sm:px-8 py-4 text-text-secondary hover:text-accent-ink hover:border-accent/40 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                  Contact Me
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Math Visualizer Block */}
          <div className="col-span-12 lg:col-span-4">
            <SpatialCanvas />
          </div>

          {/* Focus — engineering + design in one card instead of two, so the
              secondary row reads as a single quieter beat, not three more
              bordered cards competing with the headline above. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-8 bento-card p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rail-card-teal">
                <h4 className="text-xs uppercase text-text-tertiary mb-3 tracking-widest">
                  Engineering
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["React/Next.js", "Tailwind", "TypeScript", "Motion"].map(
                    (t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="rail-card-cold">
                <h4 className="text-xs uppercase text-text-tertiary mb-3 tracking-widest">
                  Design
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Figma", "Motion Design", "Interaction", "Systems"].map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 md:col-span-4 bento-card aqua-surface p-6 flex items-center justify-center group transition-all duration-500 hover:scale-[1.01]"
          >
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-black font-black uppercase text-lg sm:text-xl group-hover:tracking-[0.15em] sm:group-hover:tracking-[0.5em] transition-all duration-500"
            >
              Resume.PDF
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ── FEATURED PROJECTS ───────────────────────────── */}
      <motion.section
        id="work"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.05 }}
        className="max-w-7xl mx-auto mb-20 sm:mb-32"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-accent-ink text-xs font-bold uppercase tracking-widest mb-2 block">
              {"// Selected Works"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Featured Projects
            </h2>
          </div>
          <div className="h-px bg-ink/10 flex-grow mx-8 mb-1 hidden md:block" />
          <div className="text-xs text-text-tertiary mb-1">01 — 05</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              staggerOffset={index % 2 === 1}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10 sm:mt-14">
          <Link
            href="/archive"
            className="group inline-flex items-center gap-2 px-6 py-3 border border-ink/20 text-sm font-medium tracking-widest uppercase hover:border-accent hover:text-accent-ink transition-colors duration-300"
          >
            View All Projects
            <svg
              className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </motion.section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.08 }}
        className="max-w-7xl mx-auto mb-20 sm:mb-32"
      >
        <SectionDivider number="01" label="About Me" accent="accent" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Mathematics to <span className="gradient-text">Design</span>
            </h2>
            <div className="font-sans space-y-4 text-text-secondary text-sm leading-relaxed">
              <p>
                I'm a UX Engineer with a mathematics background, specializing in
                creating high-performance interfaces that feel intuitive and
                precise. My journey began in abstract problem-solving, but I
                quickly realized my true passion was making complex systems
                accessible to everyday users.
              </p>
              <p>
                Every project I work on blends rigorous logic with
                human-centered design principles. I believe the best digital
                experiences are those where users never notice the
                engineering—they just work beautifully.
              </p>
              <p>
                I'm particularly passionate about performance optimization,
                interaction design, and building design systems that scale. When
                I'm not coding, you'll find me exploring the intersection of
                mathematics, motion, and meaningful user experiences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bento-card p-5 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-accent-ink mb-2">
                5+
              </div>
              <p className="text-xs uppercase tracking-widest text-text-tertiary">
                Projects Shipped
              </p>
            </div>
            <div className="bento-card p-5 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-accent-ink mb-2">
                100%
              </div>
              <p className="text-xs uppercase tracking-widest text-text-tertiary">
                Attention to Detail
              </p>
            </div>
            <div className="bento-card p-5 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-accent-ink mb-2">
                3+
              </div>
              <p className="text-xs uppercase tracking-widest text-text-tertiary">
                Years Experience
              </p>
            </div>
            <div className="bento-card p-5 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-accent-ink mb-2">
                24h
              </div>
              <p className="text-xs uppercase tracking-widest text-text-tertiary">
                Response Time
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── DESIGN PROCESS ───────────────────────────────── */}
      <motion.section
        id="process"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
        className="max-w-7xl mx-auto mb-20 sm:mb-32"
      >
        <SectionDivider number="02" label="How I Think" accent="accent-cold" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold mb-4">
              How I<br />
              <span className="text-accent-cold-ink">Think</span>
            </h2>
            <p className="text-text-tertiary text-xs uppercase leading-loose tracking-widest">
              Bridging Mathematics and User Experience
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: "01.",
                title: "Research",
                body: "Identifying variables. Understanding the problem set before writing a single line of code.",
              },
              {
                num: "02.",
                title: "Design",
                body: "Geometry and flow. Crafting visual hierarchies that feel intuitive and balanced.",
              },
              {
                num: "03.",
                title: "Engineering",
                body: "Transformation. Turning pixels into performant, scalable, and responsive systems.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bento-card p-8 border border-ink/10 bg-ink/[0.02]"
              >
                <span className="text-accent-cold-ink text-lg font-bold mb-4 block">
                  {step.num} {step.title}
                </span>
                <p className="font-sans text-sm text-text-secondary">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PLAYGROUND ───────────────────────────────────── */}
      <motion.section
        id="companies"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.11 }}
        className="max-w-7xl mx-auto mb-12 sm:mb-16"
      >
        <div className="mb-4 sm:mb-6 text-center">
          <span className="text-accent-ink text-xs font-bold uppercase tracking-widest block mb-2">
            {"// Trusted Collaborations"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Companies I&apos;ve Worked With
          </h2>
        </div>

        <div className="company-marquee border border-ink/10 bg-ink/[0.02] py-5 sm:py-7">
          <div className="company-marquee-track" aria-label="Companies marquee">
            {[0, 1].map((groupIndex) => (
              <div
                key={`company-group-${groupIndex}`}
                className="company-marquee-group"
              >
                {allCompanies.map((company) => {
                  const card = (
                    <div className="company-marquee-item">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 border border-ink/10 bg-bg/40 p-2 rounded-md flex items-center justify-center mb-2">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          loading="lazy"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="font-sans text-[11px] sm:text-xs text-text-secondary uppercase tracking-[0.18em] text-center">
                        {company.name}
                      </p>
                    </div>
                  );

                  if (company.website) {
                    return (
                      <a
                        key={`${groupIndex}-${company.id}`}
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="company-marquee-link"
                      >
                        {card}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={`${groupIndex}-${company.id}`}
                      className="company-marquee-link"
                    >
                      {card}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── LAB ──────────────────────────────────────────── */}
      <motion.section
        id="lab"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.12 }}
        className="max-w-7xl mx-auto mb-20 sm:mb-32 bg-ink/[0.02] p-5 sm:p-10 md:p-12 border-y border-ink/5 relative"
      >
        <div className="mb-8 sm:mb-12">
          <span className="text-accent-cold-ink text-xs font-bold uppercase tracking-widest mb-2 block">
            {"// From the Codebase"}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Math, rendered.
          </h2>
          <p className="font-sans text-text-secondary text-sm max-w-2xl">
            The rotating geometry in the visualizer above isn&apos;t a stock
            animation — it&apos;s two SVG orbits driven by real coordinates,
            straight from this site&apos;s own source.
          </p>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-ink/10 bg-ink/[0.02]">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-cold/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent/40" />
            <span className="text-[10px] font-mono text-text-tertiary ml-2 tracking-widest">
              components/spatial-canvas.tsx
            </span>
          </div>
          <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm leading-relaxed font-mono">
            <code>
              {CODE_SNIPPET.map((line, i) => (
                <div key={i}>
                  {line.map((seg, j) => (
                    <span key={j} className={TOKEN_TONE[seg.t]}>
                      {seg.s}
                    </span>
                  ))}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </motion.section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
        className="max-w-4xl mx-auto mb-20 sm:mb-32 text-center"
      >
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-8 sm:mb-12 tracking-tighter">
          Let&apos;s build something{" "}
          <span className="gradient-text">meaningful.</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
          <a
            href="mailto:adebisireuel@gmail.com"
            className="text-base sm:text-xl md:text-3xl border-b border-ink/20 hover:border-accent transition-all pb-2 break-all"
          >
            adebisireuel@gmail.com
          </a>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a
              href="https://x.com/jethroadebisi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-accent-ink transition-colors"
            >
              Twitter/X
            </a>
            <a
              href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-accent-ink transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/adebisijethro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-accent-ink transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 p-5 sm:p-8 border border-ink/10 max-w-lg mx-auto bg-ink/5 bento-card">
          <div className="mb-6">
            <p className="text-xs text-text-secondary mb-1 font-mono uppercase tracking-widest">
              Response Time
            </p>
            <p className="font-sans text-sm text-text-secondary">
              I typically respond within 24 hours. Let's connect.
            </p>
          </div>
          <form className="text-left space-y-4" onSubmit={handleFormSubmit}>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="hidden"
            />
            <div>
              <label className="text-[10px] uppercase text-text-tertiary mb-1 block tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                title="Full Name"
                placeholder="Your full name"
                required
                disabled={isSubmitting}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="font-sans w-full bg-transparent border-b border-ink/10 py-2 focus:border-accent outline-none transition-colors text-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-text-tertiary mb-1 block tracking-widest">
                Email
              </label>
              <input
                type="email"
                title="Email"
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="font-sans w-full bg-transparent border-b border-ink/10 py-2 focus:border-accent outline-none transition-colors text-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-text-tertiary mb-1 block tracking-widest">
                Message
              </label>
              <textarea
                rows={3}
                title="Message"
                placeholder="Write your message"
                required
                disabled={isSubmitting}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="font-sans w-full bg-transparent border-b border-ink/10 py-2 focus:border-accent outline-none transition-colors text-sm disabled:opacity-50"
              />
            </div>
            {submitMessage && (
              <div
                className={`text-xs py-3 px-4 rounded font-mono ${
                  submitMessage.startsWith("✓")
                    ? "bg-accent/20 text-accent-ink border border-accent/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                }`}
              >
                {submitMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-ink text-bg font-bold text-xs uppercase tracking-widest hover:bg-accent hover:text-black transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending Message..." : "Send Message"}
            </button>
          </form>
        </div>
      </motion.section>

      <SiteFooter />
    </main>
  );
}

/* ── Section divider — same chaptered visual language as the case-study
   template's ChapterDivider, reused here for the homepage's About/Process
   sections instead of running a second, decorative-only header style. ── */
const DIVIDER_ACCENTS = {
  accent: "bg-accent/40",
  "accent-cold": "bg-accent-cold/40",
} as const;

function SectionDivider({
  number,
  label,
  accent,
}: {
  number: string;
  label: string;
  accent: keyof typeof DIVIDER_ACCENTS;
}) {
  return (
    <div className="flex items-center gap-4 mb-8 sm:mb-10">
      <div className={`w-1 h-8 rounded-full ${DIVIDER_ACCENTS[accent]}`} />
      <span className="text-[9px] font-mono text-text-tertiary tracking-widest tabular-nums">
        {number}
      </span>
      <div className="h-px flex-1 bg-ink/10" />
      <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-text-tertiary">
        {label}
      </span>
    </div>
  );
}

/* ── Faux syntax highlighting for the Lab section's code excerpt — a
   real snippet from spatial-canvas.tsx, not a hand-drawn illustration. ── */
const TOKEN_TONE = {
  tag: "text-accent-cold-ink",
  attr: "text-text-secondary",
  str: "text-accent-ink",
  plain: "text-text-tertiary",
} as const;

type Tok = { t: keyof typeof TOKEN_TONE; s: string };
const tag = (s: string): Tok => ({ t: "tag", s });
const attr = (s: string): Tok => ({ t: "attr", s });
const str = (s: string): Tok => ({ t: "str", s });
const plain = (s: string): Tok => ({ t: "plain", s });

const CODE_SNIPPET: Tok[][] = [
  [plain("<"), tag("svg"), plain(" "), attr("className"), plain("="), str('"w-64 h-64 animate-orbit-slow"')],
  [plain("     "), attr("viewBox"), plain("="), str('"0 0 100 100"'), plain(">")],
  [plain("  <"), tag("circle")],
  [plain("    "), attr("cx"), plain("="), str('"50"'), plain(" "), attr("cy"), plain("="), str('"50"'), plain(" "), attr("r"), plain("="), str('"38"')],
  [plain("    "), attr("fill"), plain("="), str('"none"'), plain(" "), attr("stroke"), plain("="), str('"#59B7FF"')],
  [plain("    "), attr("strokeWidth"), plain("="), str('"0.4"'), plain(" "), attr("strokeDasharray"), plain("="), str('"2 6"'), plain(" /"), plain(">")],
  [plain("  <"), tag("circle"), plain(" "), attr("cx"), plain("="), str('"88"'), plain(" "), attr("cy"), plain("="), str('"50"'), plain(" "), attr("r"), plain("="), str('"1.8"'), plain(" "), attr("fill"), plain("="), str('"#59B7FF"'), plain(" /"), plain(">")],
  [plain("</"), tag("svg"), plain(">")],
];
