"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { CursorFollower } from "@/components/cursor-follower";
import { ProjectCard } from "@/components/project-card";
import { ScrollProgress } from "@/components/scroll-progress";
import { SpatialCanvas } from "@/components/spatial-canvas";
import { TopNav } from "@/components/top-nav";
import { companies, projects, type Company, type Project } from "@/lib/data";
import { getAllCompanies, getAllProjects } from "@/lib/project-store";

export default function HomePage() {
  const [allProjects] = useState<Project[]>(getAllProjects());
  const [allCompanies] = useState<Company[]>(getAllCompanies());
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
  const currentYear = new Date().getFullYear();
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
        setTimeout(() => setSubmitMessage(""), 5000);
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
    <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
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
          {/* Main header card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-8 bento-card hyper-border p-6 sm:p-10 flex flex-col justify-between min-h-[420px] sm:min-h-[500px]"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/30 text-accent text-[10px] uppercase tracking-[0.2em]">
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
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                Mathematics student turned UX Engineer. I bridge the gap between
                abstract logic and human centered design through high
                performance web interfaces.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
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
                  className="px-6 sm:px-8 py-4 border border-white/20 hover:border-accent transition-colors font-bold uppercase tracking-widest text-xs text-center w-full sm:w-auto"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </motion.div>

          {/* Math Visualizer Block */}
          <div className="col-span-12 lg:col-span-4">
            <SpatialCanvas />
          </div>

          {/* Expertise chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-4 bento-card rail-card-teal p-6"
          >
            <h4 className="text-xs uppercase text-gray-500 mb-4 tracking-widest">
              Engineering
            </h4>
            <div className="flex flex-wrap gap-2">
              {["React/Next.js", "Tailwind", "TypeScript", "Framer Motion"].map(
                (t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 md:col-span-4 bento-card rail-card-purple p-6"
          >
            <h4 className="text-xs uppercase text-gray-500 mb-4 tracking-widest">
              Design
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Figma", "Motion Design", "Interaction", "Systems"].map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
            <span className="text-accent text-xs font-bold uppercase tracking-widest mb-2 block">
              {"// Selected Works"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Featured Projects
            </h2>
          </div>
          <div className="h-px bg-white/10 flex-grow mx-8 mb-1 hidden md:block" />
          <div className="text-xs text-gray-500 mb-1">01 — 05</div>
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
            className="group inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-sm font-medium tracking-widest uppercase hover:border-accent hover:text-accent transition-colors duration-300"
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

      {/* ── DESIGN PROCESS ───────────────────────────────── */}
      <motion.section
        id="process"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
        className="max-w-7xl mx-auto mb-20 sm:mb-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold mb-4">
              How I<br />
              <span className="text-accent">Think</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase leading-loose tracking-widest">
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
                className="bento-card p-8 border border-white/10 bg-white/[0.02]"
              >
                <span className="text-accent text-lg font-bold mb-4 block">
                  {step.num} {step.title}
                </span>
                <p className="text-sm text-gray-400">{step.body}</p>
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
          <span className="text-accent text-xs font-bold uppercase tracking-widest block mb-2">
            {"// Trusted Collaborations"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Companies I&apos;ve Worked With
          </h2>
        </div>

        <div className="company-marquee border border-white/10 bg-white/[0.02] py-5 sm:py-7">
          <div className="company-marquee-track" aria-label="Companies marquee">
            {[0, 1].map((groupIndex) => (
              <div
                key={`company-group-${groupIndex}`}
                className="company-marquee-group"
              >
                {allCompanies.map((company) => {
                  const card = (
                    <div className="company-marquee-item">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 border border-white/10 bg-black/40 p-2 rounded-md flex items-center justify-center mb-2">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          loading="lazy"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-300 uppercase tracking-[0.18em] text-center">
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

      <motion.section
        id="playground"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ ...sectionTransition, delay: 0.12 }}
        className="max-w-7xl mx-auto mb-20 sm:mb-32 bg-zinc-900/50 p-5 sm:p-10 md:p-12 border-y border-white/5 relative"
      >
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 uppercase tracking-tighter">
            Experimental Playground
          </h2>
          <p className="text-gray-500 text-[10px] sm:text-xs tracking-widest uppercase">
            Interactive micro-experiments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <PlaygroundCounter />
          <PlaygroundToggle />
          <motion.div
            className="bento-card p-6 sm:p-8 flex flex-col items-center justify-center gap-4 group overflow-hidden h-40 sm:h-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
              Hover Pulse
            </span>
            <div className="w-8 sm:w-10 h-8 sm:h-10 border border-accent group-hover:rotate-45 group-hover:scale-150 transition-all duration-500" />
          </motion.div>
          <motion.div
            className="bento-card p-6 sm:p-8 flex flex-col items-center justify-center gap-4 group h-40 sm:h-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
              Math Glyph
            </span>
            <div className="text-xl sm:text-2xl transition-all duration-300 group-hover:scale-[2] group-hover:text-accent">
              ∫
            </div>
          </motion.div>
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
            className="text-base sm:text-xl md:text-3xl border-b border-white/20 hover:border-accent transition-all pb-2 break-all"
          >
            adebisireuel@gmail.com
          </a>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a
              href="https://x.com/jethroadebisi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-accent transition-colors"
            >
              Twitter/X
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
        </div>

        <div className="mt-16 sm:mt-24 p-5 sm:p-8 border border-white/10 max-w-lg mx-auto bg-white/5 bento-card">
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
              <label className="text-[10px] uppercase text-gray-500 mb-1 block tracking-widest">
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
                className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-gray-500 mb-1 block tracking-widest">
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
                className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-sm disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-gray-500 mb-1 block tracking-widest">
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
                className="w-full bg-transparent border-b border-white/10 py-2 focus:border-accent outline-none transition-colors text-sm disabled:opacity-50"
              />
            </div>
            {submitMessage && (
              <div
                className={`text-xs py-2 px-3 rounded ${
                  submitMessage.startsWith("✓")
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {submitMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-accent transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Initialize Contact"}
            </button>
          </form>
        </div>
      </motion.section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="py-10 sm:py-12 border-t border-white/5 text-gray-600 text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.4em]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <p>&copy; {currentYear} JETHRO ADEBISI. BUILT WITH PRECISION.</p>
          <p>DESIGNED AT THE INTERSECTION OF MATH &amp; CODE.</p>
        </div>
      </footer>
    </main>
  );
}

/* ── Local interactive playground components ── */
function PlaygroundCounter() {
  const [count, setCount] = useState(0);
  return (
    <motion.div
      className="bento-card p-6 sm:p-8 flex flex-col items-center justify-center gap-4 cursor-pointer select-none h-40 sm:h-auto hover:border-accent/50 transition-colors"
      onClick={() => setCount((c) => c + 1)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">
        Counter Engine
      </span>
      <motion.span
        key={count}
        className="text-3xl sm:text-4xl font-bold"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}
      </motion.span>
      <span className="text-[8px] text-accent uppercase">
        Click to Increment
      </span>
    </motion.div>
  );
}

function PlaygroundToggle() {
  const [on, setOn] = useState(false);
  return (
    <motion.div
      className="bento-card p-6 sm:p-8 flex flex-col items-center justify-center gap-4 cursor-pointer select-none h-40 sm:h-auto hover:border-accent/50 transition-colors"
      onClick={() => setOn((v) => !v)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-[10px] text-gray-500 uppercase tracking-widest">
        Logic Switch
      </span>
      <motion.div
        className={`w-12 sm:w-14 h-6 sm:h-7 rounded-full border relative transition-colors duration-500 ${on ? "bg-accent border-accent" : "bg-transparent border-white/20"}`}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white"
          animate={{ x: on ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </motion.div>
  );
}
