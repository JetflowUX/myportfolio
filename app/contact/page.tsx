"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ContactForm, type Topic } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { SERVICES, experience as defaultExperience, type Experience } from "@/lib/data";
import { getSiteContent } from "@/lib/project-store";

/* Contact (2026-11-03). Jethro: "create the contact page but let it contain some about me details
   too". One page to send anyone to: who he is and what he does on the left, the form on the right,
   then what he can help with (each opens the form on that subject), where he has worked, and where
   else to find him. Every fact here is already on the site; nothing new is claimed. The work
   history and résumé come from the admin, as on the home page. */

const EMAIL = "adebisireuel@gmail.com";

const STATS: [string, string][] = [
  ["60", "films made"],
  ["5", "case studies"],
  ["1st", "GDG Lagos 2024"],
];

const SERVICE_TOPIC: Topic[] = ["Product design", "A front-end build", "A launch film"];

const ELSEWHERE = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jethro-adebisi-21872a20b" },
  { label: "Behance", href: "https://www.behance.net/adebisijethro" },
  { label: "GitHub", href: "https://github.com/adebisijethro" },
  { label: "Instagram", href: "https://www.instagram.com/adebisijethro/" },
  { label: "X", href: "https://x.com/jethroadebisi" },
  { label: "Upwork", href: "https://www.upwork.com/freelancers/~01827558feddd7621e" },
];

export default function ContactPage() {
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");
  const [history, setHistory] = useState<Experience[]>(defaultExperience);
  const [topic, setTopic] = useState<Topic | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSiteContent().then((c) => {
      if (c.resumeUrl) setResumeUrl(c.resumeUrl);
      setHistory(c.experience);
    });
  }, []);

  function ask(t: Topic) {
    setTopic(t);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ScrollProgress />
      <TopNav />
      <main id="main-content" className="mx-auto max-w-[1104px] px-6 pb-28 pt-36 sm:px-8 sm:pt-40 lg:px-8 xl:px-0">
        {/* ------------------------------------------------------------ top */}
        <header className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="label">Contact</p>
            <h1 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.045em] sm:text-[64px]">
              Let&apos;s make something people get the first time.
            </h1>
          </div>
          <div className="space-y-4 lg:justify-self-end">
            <p className="inline-flex items-center gap-2.5 text-[14px] font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-ink" />
              </span>
              Open to new roles and opportunities
            </p>
            <p className="max-w-[360px] text-[15px] leading-[1.6] text-text-secondary">
              Tell me what you&apos;re building and where it&apos;s stuck, or about the role. I reply within a day.
            </p>
            <CopyEmail email={EMAIL} />
          </div>
        </header>

        {/* ------------------------------------------------ about + the form */}
        <div className="cells mt-14 grid lg:grid-cols-[5fr_7fr]">
          {/* on phones the form comes first: this is the contact page */}
          <section aria-labelledby="about-me" className="order-2 flex flex-col lg:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos/portrait-studio.webp"
              alt="Jethro Adebisi, studio portrait"
              className="aspect-[4/3] w-full border-b border-border object-cover object-[50%_12%] grayscale transition-[filter] duration-500 hover:grayscale-0 lg:aspect-[4/5]"
            />
            <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
              <div>
                <h2 id="about-me" className="text-[24px] font-bold tracking-[-0.02em]">
                  Jethro Adebisi
                </h2>
                <p className="mt-1 text-[14px] text-text-secondary">Product designer, motion designer and front-end engineer</p>
              </div>
              <div className="space-y-4 text-[15px] leading-[1.65] text-text-secondary">
                <p>
                  I studied mathematics education at the University of Lagos and taught design and editing for three
                  years before designing products full time. Both left the same habit: find the structure under a
                  messy problem, then explain it so anyone can follow.
                </p>
                <p>So I design the product, build it in React, and make the film that shows it working.</p>
                <p className="font-medium text-text">
                  My test for finished: someone using it for the first time gets it without help.
                </p>
              </div>
              <dl className="mt-auto grid grid-cols-3 border-t border-border pt-5">
                {STATS.map(([n, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd className="text-[26px] font-black leading-none tracking-[-0.04em]">{n}</dd>
                    <dd className="mt-1.5 text-[12px] leading-[1.35] text-text-tertiary">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-labelledby="write" ref={formRef} className="order-1 scroll-mt-8 bg-white/50 p-6 sm:p-10 lg:order-none">
            <div className="lg:sticky lg:top-8">
            <h2 id="write" className="text-[28px] font-bold leading-tight tracking-[-0.03em]">
              Write to me
            </h2>
            <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
              It goes straight to my inbox. Hiring?{" "}
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="font-semibold text-text underline underline-offset-4">
                Here&apos;s my résumé
              </a>
              .
            </p>
            <div className="mt-8">
              <ContactForm withTopics withLabels topic={topic} onTopic={setTopic} />
            </div>
            </div>
          </section>
        </div>

        {/* ---------------------------------------------------- what I do */}
        <section className="mt-24" aria-labelledby="help">
          <h2 id="help" className="label">
            What I can help with
          </h2>
          <div className="cells mt-8 grid md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="flex flex-col gap-4 p-6 sm:p-7">
                <span className="text-[12px] font-semibold text-text-tertiary">0{i + 1}</span>
                <h3 className="text-[20px] font-bold leading-tight tracking-[-0.02em]">{s.title}</h3>
                <p className="text-[14px] leading-[1.6] text-text-secondary">{s.body}</p>
                <button
                  type="button"
                  onClick={() => ask(SERVICE_TOPIC[i])}
                  className="label mt-auto inline-flex min-h-[44px] items-center gap-2 self-start transition-colors hover:text-text"
                >
                  Ask about this <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ work history */}
        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_2fr]" aria-labelledby="worked">
          <div>
            <h2 id="worked" className="label">
              Where I&apos;ve worked
            </h2>
            <p className="mt-4 max-w-[300px] text-[14px] leading-[1.6] text-text-secondary">
              I also volunteer as a designer with GDG Lagos, MLSA Lagos and ACM SIGCHI Lagos.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 bg-ink px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-bg transition-colors hover:bg-ink/85"
              >
                Résumé <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/jethro-adebisi-21872a20b"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[42px] items-center gap-2 border border-ink px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-bg"
              >
                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <ol className="border-t border-border">
            {history.map((e, i) => (
              <li key={e.id} className="grid gap-2 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:gap-10">
                <div>
                  <h3 className={`text-[17px] font-semibold tracking-[-0.01em] ${i === 0 ? "text-accent-ink" : ""}`}>{e.role}</h3>
                  {e.note ? <p className="mt-1.5 max-w-[520px] text-[14px] leading-[1.6] text-text-secondary">{e.note}</p> : null}
                </div>
                <p className="label !text-[11px] sm:pt-1">{e.when}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- elsewhere */}
        <section className="mt-24" aria-labelledby="elsewhere">
          <h2 id="elsewhere" className="label">
            Elsewhere
          </h2>
          <div className="cells mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {ELSEWHERE.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-[72px] items-center justify-between px-5 text-[15px] font-semibold transition-colors hover:bg-white"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-text-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text" />
              </a>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter variant="compact" />
    </>
  );
}
