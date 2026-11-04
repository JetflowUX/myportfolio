"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LightboxProvider, useLightbox } from "@/components/image-lightbox";
import { Overture } from "@/components/overture";
import { CopyEmail } from "@/components/copy-email";
import { ContactForm } from "@/components/contact-form";
import { FilmTile, ShowreelPlayer } from "@/components/film-showcase";
import { HeroProcess } from "@/components/hero-process";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import {
  SERVICES,
  experience as defaultExperience,
  projects as defaultProjects,
  testimonials as defaultTestimonials,
  type Experience,
  type Testimonial,
} from "@/lib/data";
import { homeCases, type HomeCase } from "@/lib/home-work";
import { SHOWREEL, SIX, allFilms, lightboxItem } from "@/lib/films";
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

/* The five cases and the work history live in lib/data.ts and are edited from the admin
   (2026-11-03); the page draws whatever the admin content says. */


const PROCESS = [
  { tag: "Understand", title: "Interviews first", body: "Interviews, surveys and an audit of what people use today, in their words." },
  { tag: "Design", title: "Flows to high fidelity", body: "Flows and wireframes, then high fidelity on a component system." },
  { tag: "Test", title: "Real people, real prototype", body: "Where they hesitate is where the next version starts." },
  { tag: "Build", title: "React and Next.js", body: "Built in code, or handed off with specs an engineer can build from." },
  { tag: "Film", title: "The launch film", body: "A film that shows the product working, made by the person who designed it." },
  { tag: "Result", title: "GigsGig, +40% trust", body: "Trust score in usability testing after the redesign, and 3.2× faster task completion." },
];

const PHOTOS = [
  { src: "/photos/gimbalabs-session.webp", alt: "Jethro presenting a Cardano x Gimbalabs session", caption: "Gimbalabs session" },
  { src: "/photos/cardano-summit-2026.webp", alt: "Jethro at the Cardano Africa Tech Summit 2026", caption: "Cardano Summit 2026" },
  { src: "/photos/flaskcon-africa-2025.webp", alt: "Jethro at FlaskCon Africa 2025", caption: "FlaskCon Africa 2025" },
  { src: "/photos/udc-2024.webp", alt: "Jethro at UDC 2024", caption: "UDC 2024" },
  { src: "/photos/cardano-summit-gimbalabs.webp", alt: "Jethro with the Gimbalabs team", caption: "Gimbalabs team" },
  { src: "/photos/nithub-meta-unilag.webp", alt: "Jethro at a Nithub x Meta event at UNILAG", caption: "Nithub x Meta" },
];

/* ------------------------------------------------------------------ pieces */

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`label ${className}`}>{children}</h2>;
}

function More({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="label relative z-10 mt-4 inline-flex min-h-[44px] items-center gap-2 py-2 transition-colors hover:text-text">
      {children} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

/* -------------------------------------------------------------------- hero */

function Hero({ ready, resumeUrl, caseCount }: { ready: boolean; resumeUrl: string; caseCount: number }) {
  const { open } = useLightbox();
  return (
    <HeroProcess
      caseCount={caseCount}
      ready={ready}
      resumeUrl={resumeUrl}
      onMotion={() => open({ src: "/films/sabi-launch.mp4", alt: "SabiBank launch film", kind: "video", title: "SabiBank · launch film", meta: "0:40 · launch film" })}
    />
  );
}

/* --------------------------------------------------------------- the work */

function Work({ cases }: { cases: HomeCase[] }) {
  const [active, setActive] = useState(0);

  return (
    <section id="work" className="scroll-mt-10">
      <Label>Selected work</Label>

      {/* wide screens: an accordion of spines, one case open at a time */}
      <div className="mt-10 hidden h-[340px] gap-1.5 md:flex">
        {cases.map((c, i) => {
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
                  className="block h-full w-[48%] shrink-0 overflow-hidden border border-black/10"
                >
                  {/* a project saved without any image gets a plain panel, not a broken one */}
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.image} alt={`${c.title} case study`} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-black/[0.05]" />
                  )}
                </Link>
                {/* min-w-0 lets a long title wrap when the admin has put more than five cases here */}
                <div className={`min-w-0 flex-1 ${ink}`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${c.dark ? "text-white/70" : "text-black/70"}`}>
                    {i === 0 ? "Featured · " : ""}
                    {c.meta}
                  </p>
                  <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere]">{c.title}</h3>
                  <p className={`mt-3 line-clamp-5 text-[14px] leading-[1.6] ${c.dark ? "text-white/75" : "text-black/70"}`}>{c.line}</p>
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
        {cases.map((c) => (
          <Link key={c.slug} href={`/projects/${c.slug}`} className="block border border-black/10" style={{ background: c.bg }}>
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={`${c.title} case study`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
            ) : (
              <div className="aspect-[16/10] w-full bg-black/[0.05]" />
            )}
            <div className={`p-5 ${c.dark ? "text-white" : "text-black"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${c.dark ? "text-white/70" : "text-black/70"}`}>{c.meta}</p>
              <h3 className="mt-2 text-[20px] font-bold tracking-[-0.02em]">{c.title}</h3>
              <p className={`mt-2 text-[14px] leading-[1.6] ${c.dark ? "text-white/75" : "text-black/70"}`}>{c.line}</p>
            </div>
          </Link>
        ))}
      </div>

      <More href="/work">All projects</More>
    </section>
  );
}

/* ------------------------------------------------------------------ films */

/* The reel first and large, then six films chosen for range, then a link to all of them on The
   Shelf (2026-11-04; the moving wall of columns and its four tabs were retired). lib/films.ts holds
   the reel, the six and their lines. */
function Films() {
  const { open } = useLightbox();
  const all = allFilms();
  const six = SIX.flatMap(({ key, line }) => {
    const film = all.find((p) => p.slug === key || p.title === key);
    return film ? [{ film, line }] : [];
  });
  return (
    <section id="films" className="scroll-mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Label>Films</Label>
        <p className="max-w-[420px] text-[13px] leading-[1.55] text-text-secondary">
          Launch films and explainer videos, written, cut and animated. Click one to watch it with sound.
        </p>
      </div>
      <div className="mt-10">
        <ShowreelPlayer film={SHOWREEL} onPlay={() => open(lightboxItem(SHOWREEL))} />
      </div>
      <div className="mt-14 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {six.map(({ film, line }) => (
          <FilmTile key={film.slug} film={film} line={line} onOpen={() => open(lightboxItem(film))} />
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <Link href="/work?tab=films" className="label inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-text">
          See all {all.length} films <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <a href={`mailto:${EMAIL}?subject=A%20film`} className="label inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-text">
          Commission one <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- page */

export default function HomePage() {
  const [ready, setReady] = useState(false);

  // The résumé, the selected work and the work history are admin-managed (Vercel Blob). The
  // built-in defaults draw first, so the page looks the same before the content arrives.
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");
  const [cases, setCases] = useState<HomeCase[]>(() => homeCases(defaultProjects));
  const [caseCount, setCaseCount] = useState(defaultProjects.length);
  const [history, setHistory] = useState<Experience[]>(defaultExperience);
  const [quotes, setQuotes] = useState<Testimonial[]>(defaultTestimonials);
  useEffect(() => {
    getSiteContent().then((c) => {
      if (c.resumeUrl) setResumeUrl(c.resumeUrl);
      setCases(homeCases(c.projects));
      setCaseCount(c.projects.length);
      setHistory(c.experience);
      setQuotes(c.testimonials);
    });
  }, []);

  return (
    <LightboxProvider>
      <Overture onFinish={() => setReady(true)} />
      <ScrollProgress />
      <TopNav />

      <main id="main-content">
        <div className="mx-auto max-w-[1104px] space-y-28 px-6 pb-28 pt-36 sm:px-8 sm:pt-32 lg:px-8 lg:pt-[120px] xl:px-0">
        <Hero ready={ready} resumeUrl={resumeUrl} caseCount={caseCount} />

        {/* ------------------------------------------------------- what I do */}
        <section>
          <Label>What I do</Label>
          <div className="cells mt-10 grid md:grid-cols-3">
            {SERVICES.map((d) => (
              <div key={d.title} className="p-6">
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{d.title}</h3>
                <p className="mt-3 max-w-[290px] text-[14px] leading-[1.6] text-text-secondary">{d.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Work cases={cases} />
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
                {/* his test for being done, in one line; check it reads like him */}
                <p className="font-medium text-text">
                  My test for finished: someone using it for the first time gets it without help.
                </p>
              </div>
            </div>
          </div>

          <ol className="mt-16 border-t border-border">
            {history.map((e, i) => (
              <li key={e.id} className="grid gap-2 border-b border-border py-6 sm:grid-cols-[1fr_auto] sm:gap-10">
                <div>
                  <h3 className={`text-[20px] font-semibold tracking-[-0.02em] ${i === 0 ? "text-accent-ink" : ""}`}>{e.role}</h3>
                  <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-text-secondary">{e.note}</p>
                </div>
                <p className="label !text-[11px] sm:pt-2">{e.when}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------- what people say */}
        {/* added in the admin (Testimonials); hidden until there is one */}
        {quotes.length ? (
          <section>
            <Label>What people say</Label>
            <div className={`cells mt-10 grid ${quotes.length === 1 ? "" : quotes.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {quotes.map((q) => (
                <figure key={q.id} className="flex flex-col justify-between gap-8 p-6 sm:p-7">
                  <blockquote className={`leading-[1.5] tracking-[-0.01em] text-text ${quotes.length === 1 ? "max-w-[760px] text-[22px] sm:text-[26px]" : "text-[17px]"}`}>
                    <span aria-hidden className="mb-3 block font-serif text-[44px] leading-[0.6] text-accent-ink">&ldquo;</span>
                    {q.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {q.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={q.photo} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover grayscale" />
                    ) : (
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.07] text-[14px] font-semibold">
                        {q.name.charAt(0)}
                      </span>
                    )}
                    <span>
                      <span className="block text-[14px] font-semibold">{q.name}</span>
                      {q.role ? <span className="block text-[13px] text-text-tertiary">{q.role}</span> : null}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

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
            {/* two doors: an employer and a client want different next steps */}
            <div className="grid shrink-0 gap-3 sm:min-w-[300px]">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70">Hiring?</p>
                <div className="flex flex-wrap gap-2">
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-black px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5">
                    Résumé
                  </a>
                  <a href="https://www.linkedin.com/in/jethro-adebisi-21872a20b" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-black px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5">
                    LinkedIn
                  </a>
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-black/70">Have a product?</p>
                <a href="#write" className="inline-flex items-center gap-2 bg-black px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5">
                  Start a project <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div id="write" className="cells mt-1.5 grid scroll-mt-10 lg:grid-cols-2">
            <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
              <div>
                <p className="label">Or write here</p>
                <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-text-secondary">
                  Tell me what you&apos;re building and where it&apos;s stuck. I reply within a day.
                </p>
              </div>
              <CopyEmail email={EMAIL} />
            </div>

            <div className="p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
        </div>
      </main>

      <SiteFooter />
    </LightboxProvider>
  );
}
