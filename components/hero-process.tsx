"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import { SabiPanel, SabiStage } from "@/components/sabi/hero-stage";
import { MotionGraph } from "@/components/motion-graph";

/* ---------------------------------------------------------------------------
   HERO (2026-11-02)

   Jethro on the first pass: "the hero section looks like a direct copy of the
   nader.io portfolio website improve on it." The giant letter tiles and the
   pattern cells were nader.io's idea; this keeps only the grid language (the
   hairline cells the rest of the page uses) and shows what is his alone: one
   product taken through all three of his trades by one person. A 3D version
   was tried after this one and he asked for this one back ("not his style the
   second one you created").

   Left: three rows, "Design it." "Build it." "Film it.", the active one in
   ink and the others in grey, a line filling under the active row as it runs.
   Right: one stage and one screen, SabiBank's real home screen (his case
   study, rebuilt in HTML from public/work/sabibank-home.webp), which is a
   wireframe with selection handles in Design, gets its fills and words element
   by element in Build while the code types beside it. The third step,
   "Animate it.", swaps the screen for components/motion-graph.tsx: the gold
   Allophone motion study over a graph editor of its real keyframes (Jethro's
   choice, 2026-11-02, in place of a made-up SabiBank launch film).

   It cycles on its own while on screen; hovering or tapping a row holds it
   there. Reduced motion: no cycling, the rows still switch it.
   --------------------------------------------------------------------------- */

const STEPS = [
  { word: "Design it.", label: "Design", note: "Research, flows, prototypes, testing" },
  { word: "Build it.", label: "Build", note: "React, Next.js, TypeScript" },
  { word: "Film it.", label: "Film", note: "Launch films and motion design" },
] as const;

const CYCLE = 4600;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ the hero */

export function HeroProcess({
  ready,
  resumeUrl,
  onMotion,
  caseCount,
}: {
  ready: boolean;
  resumeUrl: string;
  onMotion: () => void;
  /** how many case studies the admin holds (2026-11-03: it read a fixed 5 after Pixrosu made 7) */
  caseCount: number;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = ready && !held && visible && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setStep((s) => (s + 1) % 3);
      setCycle((c) => c + 1);
    }, CYCLE);
    return () => window.clearTimeout(t);
  }, [running, step]);

  const choose = (i: number) => {
    if (i !== step) setCycle((c) => c + 1);
    setStep(i);
  };

  const film = step === 2;

  return (
    <section ref={ref} aria-label="Introduction">
      <h1 className="sr-only">Jethro Adebisi, product designer, motion designer and front-end engineer. I design it, build it, and film it.</h1>

      {/* meta strip */}
      <motion.div
        className="cells grid grid-cols-2 text-[12px] text-text-secondary sm:grid-cols-[1fr_auto_auto]"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="col-span-2 flex items-center gap-2.5 px-4 py-3 sm:col-span-1">
          <span className="h-2 w-2 bg-accent" />
          Open to remote product design roles and freelance projects
        </p>
        <p className="px-4 py-3">Product designer, motion designer and front-end engineer</p>
        <a href={resumeUrl} target="_blank" rel="noreferrer" className="group flex items-center justify-end gap-1.5 px-4 py-3 font-semibold text-text">
          Résumé <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      <div className="grid border-l border-border lg:grid-cols-[1fr_580px]" onMouseLeave={() => setHeld(false)}>
        {/* the three rows */}
        <div className="grid border-b border-border lg:border-b-0" role="tablist" aria-label="What I do">
          {STEPS.map((s, i) => {
            const on = i === step;
            return (
              <button
                key={s.word}
                type="button"
                role="tab"
                aria-selected={on}
                onMouseEnter={() => {
                  setHeld(true);
                  choose(i);
                }}
                onFocus={() => choose(i)}
                onClick={() => {
                  setHeld(true);
                  choose(i);
                }}
                className="relative flex flex-col justify-between border-b border-r border-border px-4 pb-3 pt-4 text-left last:border-b-0 lg:h-[150px] lg:last:border-b"
              >
                <span className="flex w-full items-baseline justify-between gap-4">
                  <span className="label !text-[10px]">
                    0{i + 1} · {s.label}
                  </span>
                  <span className={`hidden text-[12px] transition-colors duration-500 sm:block ${on ? "text-text-secondary" : "text-text-tertiary/60"}`}>{s.note}</span>
                </span>
                {/* the padding lets descenders (the g) inside the mask without changing the row */}
                <span className="-mb-[0.16em] block overflow-hidden pb-[0.16em] pt-2 text-[54px] sm:text-[76px] lg:text-[84px]">
                  <motion.span
                    className="giant block !leading-[1] text-[54px] transition-colors duration-500 sm:text-[76px] lg:text-[84px]"
                    style={{ color: on ? "rgb(var(--ink-rgb))" : "#8b8b89" }} /* inactive rows 3.3:1, large type (was #cdcdcb, 1.4:1) */
                    initial={{ y: "105%" }}
                    animate={{ y: ready ? "0%" : "105%" }}
                    transition={{ duration: 0.9, delay: ready ? 0.1 + i * 0.12 : 0, ease: EASE }}
                  >
                    {s.word}
                  </motion.span>
                </span>
                {/* the run line under the active row */}
                {on && running ? (
                  <motion.span
                    key={`run-${cycle}`}
                    className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent-ink"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE / 1000, ease: "linear" }}
                  />
                ) : on ? (
                  <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-accent-ink" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* the stage */}
        <motion.div
          className="relative overflow-hidden border-b border-r border-border transition-colors duration-700 lg:h-[450px]"
          style={{
            backgroundColor: film ? "#111110" : "transparent",
            backgroundImage: film ? "none" : "radial-gradient(rgb(17 17 17 / 0.13) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
          onMouseEnter={() => setHeld(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.8, delay: ready ? 0.35 : 0 }}
        >
          {film ? (
            <div className="h-full p-4 sm:p-5">
              <MotionGraph key={cycle} onOpen={onMotion} />
            </div>
          ) : (
          <div className="flex h-full flex-col gap-6 p-5 sm:flex-row sm:items-stretch sm:p-6">
            <div className="order-2 h-[300px] overflow-hidden sm:order-1 sm:h-auto sm:flex-1">
              <SabiPanel mode={step} cycle={cycle} />
            </div>
            <div className="order-1 flex shrink-0 items-center justify-center sm:order-2">
              <motion.div
                animate={film ? { scale: 1.06, rotate: -1.5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: film ? CYCLE / 1000 : 0.6, ease: film ? "linear" : EASE }}
                className={film ? "drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]" : ""}
              >
                <SabiStage mode={step} cycle={cycle} />
              </motion.div>
            </div>
          </div>
          )}
        </motion.div>
      </div>

      {/* bottom strip */}
      <motion.div
        className="grid grid-cols-[96px_1fr] border-l border-border sm:grid-cols-[120px_1fr_1fr] lg:grid-cols-[150px_1.5fr_1fr_1fr]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
        transition={{ duration: 0.7, delay: ready ? 0.5 : 0, ease: EASE }}
      >
        <div className="border-b border-r border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/avatar.webp?v=2" alt="Jethro Adebisi" className="aspect-square h-full w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0" />
        </div>
        {/* the plain line a skimming reviewer needs: what he is, and the proof, in one place */}
        <div className="border-b border-r border-border p-4">
          <p className="text-[17px] font-semibold leading-[1.35] tracking-[-0.01em] text-text">
            Product designer who builds in React and makes the launch film.
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-text-secondary">
            I&apos;m Jethro. I take products from user interviews to tested prototypes, then build them and film them.
          </p>
        </div>
        <dl className="col-span-2 grid grid-cols-3 border-b border-r border-border sm:col-span-1 sm:grid-cols-1 sm:content-center sm:gap-2 sm:p-4">
          {[
            ["60", "films made"],
            [String(caseCount), caseCount === 1 ? "case study" : "case studies"],
            ["1st", "GDG Lagos 2024"],
          ].map(([v, k]) => (
            <div key={k} className="flex flex-col items-start gap-0.5 p-4 sm:flex-row sm:items-baseline sm:gap-2 sm:p-0">
              <dt className="text-[18px] font-black tracking-[-0.03em] text-text">{v}</dt>
              <dd className="text-[12px] text-text-tertiary">{k}</dd>
            </div>
          ))}
        </dl>
        <ul className="col-span-2 flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-r border-border p-4 text-[13px] sm:col-span-3 lg:col-span-1 lg:flex-col lg:items-start lg:justify-center">
          <li>
            {/* a link icon before each, so they read as links (his ask, 2026-11-03) */}
            <a href="mailto:adebisireuel@gmail.com" className="inline-flex min-h-[32px] items-center gap-1.5 font-semibold hover:underline">
              <LinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Email me
            </a>
          </li>
          {[
            ["LinkedIn", "https://www.linkedin.com/in/jethro-adebisi-21872a20b"],
            ["Behance", "https://www.behance.net/adebisijethro"],
            ["GitHub", "https://github.com/adebisijethro"],
          ].map(([k, href]) => (
            <li key={k}>
              <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-[32px] items-center gap-1.5 text-text-secondary hover:text-text">
                <LinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {k}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
