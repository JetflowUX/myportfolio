"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LightboxProvider, useLightbox } from "@/components/image-lightbox";
import { Overture } from "@/components/overture";
import { CopyEmail } from "@/components/copy-email";
import { FilmColumns } from "@/components/film-columns";
import { HeroProcess } from "@/components/hero-process";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { driveFilms, motionWork, type MotionPiece } from "@/lib/data";
import { getSiteContent } from "@/lib/project-store";

/* ---------------------------------------------------------------------------
   HOME, fifth pass (2026-11-02)

   Jethro: "i want my portfolio site to look like this https://nader.io/ ...
   also use the animation on this website https://edisonfangworkshop.com/".

   So: nader.io's Swiss grid on warm grey paper, hairline cells sharing their
   borders, and his sections laid out the way that site lays out its own: a
   three-cell "what I do", case studies as an accordion of spines, films as a
   grey image grid, process as a card grid, experience as a dated list, and an
   accent banner to close. Edison Fang's opening plays first (components/
   overture.tsx), and the hero rises in as it fades.

   The hero is components/hero-process.tsx (design it, build it, film it, on
   the SabiBank screen). Three heroes were tried the same day: a copy of
   nader.io's letter grid ("looks like a direct copy"), this one ("looks
   basic"), and a 3D room ("even worse"). He chose this one: "not his style
   the second one you created".

   His accent stays his aqua, used as a fill, never as text on the paper.
   Copy carries no em dashes (his rule). The previous page is in
   portfolio/myportfolio-backup-2026-11-02.
   --------------------------------------------------------------------------- */

const EMAIL = "adebisireuel@gmail.com";

type Case = {
  slug: string;
  title: string;
  meta: string;
  line: string;
  image: string;
  bg: string;
  dark?: boolean;
};

const CASES: Case[] = [
  {
    slug: "sabi-bank-app",
    title: "SabiBank",
    meta: "Fintech · 2024",
    line: "A personal-finance app for students who find banking apps confusing, slow and built for someone else. Plain language, ready-made student budgets, automatic categories.",
    image: "/work/sabibank-cover.webp",
    bg: "#DDE7FB",
  },
  {
    slug: "gigsgig-app",
    title: "GigsGig",
    meta: "Marketplace · 2025",
    line: "A gig marketplace for UNILAG students. Research showed people feared each other more than the app, so the design is built around visible commitment. +40% trust score in testing.",
    image: "/work/gigsgig-cover.webp",
    bg: "#9DCBA4",
  },
  {
    slug: "ai-travel-planner",
    title: "WanderSmart",
    meta: "Travel · AI product · 2024",
    line: "A travel planner that writes a full day-by-day trip from four answers, then lets the traveller change any part of it.",
    image: "/work/wandersmart-cover.webp",
    bg: "#16151A",
    dark: true,
  },
  {
    slug: "speed-math-battle",
    title: "Speed Math",
    meta: "Front-end · Live · 2025",
    line: "Designed and built end to end: 60 fps on mid-range phones, 44 px touch targets, keyboard play and WCAG AA contrast.",
    image: "/work/speedmath-cover.webp",
    bg: "#0B1C2E",
    dark: true,
  },
  {
    slug: "backup-line-cloud-storage",
    title: "Backup Line",
    meta: "B2B · Cloud storage · 2024",
    line: "Cloud storage for business teams, reorganised around projects so files are found in seconds and never lost by accident.",
    image: "/work/backupline-cover.webp",
    bg: "#E6EDCF",
  },
];

const DOING = [
  {
    title: "Designing products people trust",
    body: "User interviews, flows, prototypes and usability testing, through to a design system an engineer can build from.",
  },
  {
    title: "Building them in code",
    body: "React, Next.js, TypeScript and Tailwind. What I design ships the way it was designed.",
  },
  {
    title: "Films that explain them",
    body: "Launch films, explainers and adverts, cut and animated. 60 made so far.",
  },
];

const PROCESS = [
  { tag: "Understand", title: "Interviews first", body: "Interviews, surveys and an audit of what people use today, in their words." },
  { tag: "Design", title: "Flows to high fidelity", body: "Flows and wireframes, then high fidelity on a component system." },
  { tag: "Test", title: "Real people, real prototype", body: "Where they hesitate is where the next version starts." },
  { tag: "Build", title: "React and Next.js", body: "Built in code, or handed off with specs an engineer can build from." },
  { tag: "Film", title: "The launch film", body: "A film that shows the product working, made by the person who designed it." },
  { tag: "Result", title: "GigsGig, +40% trust", body: "Trust score in usability testing after the redesign, and 3.2× faster task completion." },
];

const EXPERIENCE = [
  {
    when: "2023 to now",
    role: "Freelance product designer & front-end engineer",
    note: "Fintech, Web3 and consumer apps, from research to production React. Cardano ecosystem work with Gimbalabs and Andamio.",
  },
  { when: "2024", role: "Designer, GDG UNILAG, Lagos", note: "Design for the Google Developer Group at the University of Lagos." },
  { when: "2022", role: "Digital designer, Filtar.Africa", note: "Web, social and marketing design. Google UX Design certificate." },
  { when: "2019 to 2022", role: "Instructor, Kavit Digital", note: "Taught Photoshop, Illustrator, InDesign, Premiere Pro and After Effects." },
];

const PHOTOS = [
  { src: "/photos/gimbalabs-session.webp", alt: "Jethro presenting a Cardano x Gimbalabs session", caption: "Gimbalabs session" },
  { src: "/photos/cardano-summit-2026.webp", alt: "Jethro at the Cardano Africa Tech Summit 2026", caption: "Cardano Summit 2026" },
  { src: "/photos/flaskcon-africa-2025.webp", alt: "Jethro at FlaskCon Africa 2025", caption: "FlaskCon Africa 2025" },
  { src: "/photos/udc-2024.webp", alt: "Jethro at UDC 2024", caption: "UDC 2024" },
  { src: "/photos/cardano-summit-gimbalabs.webp", alt: "Jethro with the Gimbalabs team", caption: "Gimbalabs team" },
  { src: "/photos/nithub-meta-unilag.webp", alt: "Jethro at a Nithub x Meta event at UNILAG", caption: "Nithub x Meta" },
];

const REEL: MotionPiece = {
  slug: "reel",
  title: "Showreel",
  kind: "Motion graphics",
  blurb: "",
  meta: "0:45 · press play for sound",
  poster: "/motion/poster/reel-poster.jpg",
  loop: "/motion/reel.mp4",
  watch: "/motion/reel.mp4",
};

/* His SabiBank launch film (ads/sabibank, 2026-11-03): the same app the hero designs and builds. */
const SABI_FILM: MotionPiece = {
  slug: "sabi-launch",
  title: "SabiBank · Launch film",
  kind: "Product film",
  blurb: "",
  meta: "0:40 · launch film",
  poster: "/films/poster/sabi-launch.jpg",
  loop: "/films/loop/sabi-launch.mp4",
  watch: "/films/sabi-launch.mp4",
};

/* ------------------------------------------------------------------ pieces */

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`label ${className}`}>{children}</h2>;
}

function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="label mt-6 inline-flex items-center gap-2 transition-colors hover:text-text">
      {children} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

/* -------------------------------------------------------------------- hero */

function Hero({ ready, resumeUrl }: { ready: boolean; resumeUrl: string }) {
  const { open } = useLightbox();
  return (
    <HeroProcess
      ready={ready}
      resumeUrl={resumeUrl}
      onMotion={() => open({ src: "/films/sabi-launch.mp4", alt: "SabiBank launch film", kind: "video", title: "SabiBank · launch film", meta: "0:40 · launch film" })}
    />
  );
}

/* --------------------------------------------------------------- the work */

function Work() {
  const [active, setActive] = useState(0);

  return (
    <section id="work" className="scroll-mt-10">
      <Label>Selected work</Label>

      {/* wide screens: an accordion of spines, one case open at a time */}
      <div className="mt-10 hidden h-[340px] gap-1.5 md:flex">
        {CASES.map((c, i) => {
          const isOpen = i === active;
          const ink = c.dark ? "text-white" : "text-black";
          return (
            <div
              key={c.slug}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="relative flex overflow-hidden border border-black/10 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ background: c.bg, flexGrow: isOpen ? 7 : 1, flexBasis: 0 }}
            >
              {/* the spine */}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={isOpen}
                aria-label={`${c.title}, ${c.meta}`}
                className={`flex shrink-0 flex-col items-center justify-between py-6 ${ink} ${isOpen ? "w-[60px] border-r border-black/10 lg:w-[72px]" : "w-full"}`}
              >
                <span className="text-[17px] font-semibold tracking-tight [writing-mode:vertical-rl]">{c.title}</span>
                <span className="block h-2.5 w-full" style={{ background: "linear-gradient(90deg,#00FFC2 0 33%,#111 33% 66%,#59B7FF 66%)" }} />
              </button>

              {/* the open case */}
              <div
                className={`flex min-w-0 flex-1 items-center gap-8 p-6 transition-opacity duration-500 lg:p-7 ${isOpen ? "opacity-100 delay-200" : "pointer-events-none opacity-0"}`}
                aria-hidden={!isOpen}
              >
                <Link
                  href={`/projects/${c.slug}`}
                  tabIndex={isOpen ? 0 : -1}
                  className="block h-full w-[52%] shrink-0 overflow-hidden border border-black/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={`${c.title} case study`} className="h-full w-full object-cover" loading="lazy" />
                </Link>
                <div className={`min-w-[220px] ${ink}`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${c.dark ? "text-white/60" : "text-black/55"}`}>
                    {i === 0 ? "Featured · " : ""}
                    {c.meta}
                  </p>
                  <h3 className="mt-3 text-[22px] font-bold tracking-[-0.02em]">{c.title}</h3>
                  <p className={`mt-3 text-[14px] leading-[1.6] ${c.dark ? "text-white/75" : "text-black/70"}`}>{c.line}</p>
                  <Link
                    href={`/projects/${c.slug}`}
                    tabIndex={isOpen ? 0 : -1}
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] hover:underline"
                  >
                    Read the case study <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* phones: the same cases, stacked */}
      <div className="mt-8 grid gap-1.5 md:hidden">
        {CASES.map((c) => (
          <Link key={c.slug} href={`/projects/${c.slug}`} className="block border border-black/10" style={{ background: c.bg }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={`${c.title} case study`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
            <div className={`p-5 ${c.dark ? "text-white" : "text-black"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${c.dark ? "text-white/60" : "text-black/55"}`}>{c.meta}</p>
              <h3 className="mt-2 text-[20px] font-bold tracking-[-0.02em]">{c.title}</h3>
              <p className={`mt-2 text-[14px] leading-[1.6] ${c.dark ? "text-white/75" : "text-black/70"}`}>{c.line}</p>
            </div>
          </Link>
        ))}
      </div>

      <More href="/archive">All projects</More>
    </section>
  );
}

/* ------------------------------------------------------------------ films */

function Films() {
  const { open } = useLightbox();
  const pieces = driveFilms.length ? [SABI_FILM, ...driveFilms] : [REEL, ...motionWork];
  return (
    <section id="films" className="scroll-mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Label>Films</Label>
        <p className="max-w-[420px] text-[13px] leading-[1.55] text-text-secondary">
          Launch films and explainer videos, written, cut and animated. Click one to watch it with sound.
        </p>
      </div>
      <div className="mt-10">
        <FilmColumns pieces={pieces} onOpen={(p) => open({ src: p.watch, alt: p.title, kind: p.drive ? "embed" : "video", title: p.title, meta: p.meta })} />
      </div>
      <More href={`mailto:${EMAIL}?subject=A%20film`}>Commission one</More>
    </section>
  );
}

/* ------------------------------------------------------------------- page */

export default function HomePage() {
  const [ready, setReady] = useState(false);

  // The résumé link is admin-managed (Vercel Blob); fall back to /resume.pdf.
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");
  useEffect(() => {
    getSiteContent().then((c) => {
      if (c.resumeUrl) setResumeUrl(c.resumeUrl);
    });
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

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

  const input =
    "w-full border border-border bg-transparent px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-text-tertiary focus:border-text";

  return (
    <LightboxProvider>
      <Overture onFinish={() => setReady(true)} />
      <ScrollProgress />
      <TopNav />

      <main id="main-content">
        <div className="mx-auto max-w-[1104px] space-y-28 px-6 pb-28 pt-36 sm:px-8 sm:pt-32 lg:px-8 lg:pt-[120px] xl:px-0">
        <Hero ready={ready} resumeUrl={resumeUrl} />

        {/* ------------------------------------------------------- what I do */}
        <section>
          <Label>What I do</Label>
          <div className="cells mt-10 grid md:grid-cols-3">
            {DOING.map((d) => (
              <div key={d.title} className="p-6">
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{d.title}</h3>
                <p className="mt-3 max-w-[290px] text-[14px] leading-[1.6] text-text-secondary">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Work />
        <Films />

        {/* --------------------------------------------------------- process */}
        <section id="process" className="scroll-mt-10">
          <Label>How I work</Label>
          <div className="cells mt-10 grid sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((p, i) => (
              <div key={p.tag} className="group p-4 pb-5">
                <p className="label !text-[10px]">
                  0{i + 1} · {p.tag}
                </p>
                <h3 className="mt-5 text-[20px] font-bold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.55] text-text-secondary">{p.body}</p>
                <span className="mt-5 block h-px w-16 bg-text-tertiary transition-all duration-500 group-hover:w-28 group-hover:bg-accent-ink" />
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- about */}
        <section id="about" className="scroll-mt-10">
          <Label>About</Label>
          <div className="cells mt-10 grid md:grid-cols-[1fr_2fr]">
            <div className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/portrait-studio.webp"
                alt="Jethro Adebisi, studio portrait"
                loading="lazy"
                className="aspect-[4/5] h-full w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
              <h3 className="max-w-[560px] text-[30px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
                Maths taught me to look for the structure.
              </h3>
              <div className="max-w-[540px] space-y-4 text-[15px] leading-[1.65] text-text-secondary">
                <p>
                  I studied mathematics education at the University of Lagos and taught design and
                  editing for three years before designing products full time. Both left the same
                  habit: find the structure under a messy problem, then explain it so anyone can
                  follow.
                </p>
                <p>I volunteer as a designer with GDG Lagos, MLSA Lagos and ACM SIGCHI Lagos.</p>
              </div>
            </div>
          </div>

          <ol className="mt-16 border-t border-border">
            {EXPERIENCE.map((e, i) => (
              <li key={e.role} className="grid gap-2 border-b border-border py-6 sm:grid-cols-[1fr_auto] sm:gap-10">
                <div>
                  <h3 className={`text-[20px] font-semibold tracking-[-0.02em] ${i === 0 ? "text-accent-ink" : ""}`}>{e.role}</h3>
                  <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-text-secondary">{e.note}</p>
                </div>
                <p className="label !text-[11px] sm:pt-2">{e.when}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- community */}
        <section>
          <Label>Where I show up</Label>
          <div className="cells mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {PHOTOS.map((p) => (
              <figure key={p.src} className="group relative aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-bg/95 px-3 py-2 text-[12px] font-medium transition-transform duration-300 group-hover:translate-y-0">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- contact */}
        <section id="contact" className="scroll-mt-10">
          <div className="flex flex-col gap-8 bg-accent p-8 text-black sm:flex-row sm:items-end sm:justify-between sm:p-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]">Let&apos;s talk</p>
              <h2 className="mt-5 text-[34px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[46px]">
                Have a product
                <br />
                that needs designing?
              </h2>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex w-fit shrink-0 items-center gap-2 bg-black px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5"
            >
              Email me
            </a>
          </div>

          <div className="cells mt-1.5 grid lg:grid-cols-2">
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
              <div>
                <p className="label">Or write here</p>
                <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-text-secondary">
                  Tell me what you&apos;re building and where it&apos;s stuck. I reply within a day.
                </p>
              </div>
              <CopyEmail email={EMAIL} />
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 p-6 sm:p-8">
              {/* honeypot: the API drops anything that fills it */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              <label className="block">
                <span className="sr-only">Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={input}
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={input}
                  placeholder="you@company.com"
                />
              </label>
              <label className="block">
                <span className="sr-only">What are you building?</span>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${input} resize-none`}
                  placeholder="The product, who it's for, and what isn't working yet"
                />
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-text px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-bg transition-opacity disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send message"} <ArrowRight className="h-4 w-4" />
              </button>
              {submitMessage ? (
                <p className="text-sm text-text-secondary" role="status">
                  {submitMessage}
                </p>
              ) : null}
            </form>
          </div>
        </section>
        </div>
      </main>

      <SiteFooter />
    </LightboxProvider>
  );
}
