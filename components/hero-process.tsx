"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bell, Play } from "lucide-react";

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
   by element in Build while the code types beside it, and plays as a cut in
   Film on a dark edit bay with a timeline and a running timecode. The wireframe
   look carries on from the opening animation's lines.

   It cycles on its own while on screen; hovering or tapping a row holds it
   there. Reduced motion: no cycling, the rows still switch it.
   --------------------------------------------------------------------------- */

const STEPS = [
  { word: "Design it.", label: "Design", note: "Research, flows, prototypes, testing" },
  { word: "Build it.", label: "Build", note: "React, Next.js, TypeScript" },
  { word: "Film it.", label: "Film", note: "Launch films and explainers" },
] as const;

const CYCLE = 4600;
const EASE = [0.22, 1, 0.36, 1] as const;
const BLUE = "#4F8DF5";
const GREEN = "#16A34A";

/* --------------------------------------------------------------- the screen */

/** One element of the screen: a dashed wireframe box in Design, the built thing after. */
function Part({
  mode,
  i,
  className = "",
  style,
  wire,
  children,
}: {
  mode: number;
  i: number;
  className?: string;
  style?: React.CSSProperties;
  wire?: React.ReactNode;
  children: React.ReactNode;
}) {
  const built = mode > 0;
  return (
    <div className={`absolute ${className}`} style={style}>
      <div
        className="absolute inset-0 rounded-[inherit] border border-dashed border-black/35 transition-opacity duration-300"
        style={{ opacity: built ? 0 : 1, transitionDelay: built ? `${i * 70}ms` : "0ms" }}
      >
        {wire}
      </div>
      <div
        className="absolute inset-0 rounded-[inherit] transition-all duration-500"
        style={{
          opacity: built ? 1 : 0,
          transform: built ? "none" : "translateY(4px)",
          transitionDelay: built ? `${120 + i * 90}ms` : "0ms",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const Bar = ({ w, className = "" }: { w: string; className?: string }) => (
  <span className={`block h-[5px] rounded-full bg-black/15 ${className}`} style={{ width: w }} />
);

function Balance({ film }: { film: boolean }) {
  const [v, setV] = useState(23970.98);
  useEffect(() => {
    if (!film) {
      setV(23970.98);
      return;
    }
    const c = animate(0, 23970.98, { duration: 1.6, ease: EASE, delay: 0.3, onUpdate: setV });
    return () => c.stop();
  }, [film]);
  const [whole, cents] = v.toFixed(2).split(".");
  return (
    <span className="text-[17px] font-bold tracking-[-0.02em]" style={{ color: GREEN }}>
      $ {Number(whole).toLocaleString("en-US")}
      <span className="font-normal">.{cents}</span>
    </span>
  );
}

const NOTES = [
  ["Central Bank of Nigeria", "Your account has been updated", "Today"],
  ["Account", "Your account is limited. Please...", "11 Apr"],
  ["Alert", "Your statement is ready for you", "08 Apr"],
];

function Screen({ mode }: { mode: number }) {
  const film = mode === 2;
  return (
    <div className="relative h-[410px] w-[200px] overflow-hidden rounded-[26px] border-[5px] border-[#B9C0CB] bg-white text-[#1d1d1f]">
      {/* status */}
      <div className="absolute left-3 top-2 text-[7px] font-semibold">9:30</div>
      <div className="absolute left-1/2 top-2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-black" />

      <Part mode={mode} i={0} className="left-3 right-3 top-[20px] h-[26px] rounded-md" wire={<div className="flex h-full items-center gap-2 px-1.5"><span className="h-4 w-4 rounded-full border border-dashed border-black/35" /><Bar w="45%" /></div>}>
        <div className="flex h-full items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photos/avatar.webp?v=2" alt="" className="h-[22px] w-[22px] rounded-full object-cover" />
          <span className="text-[9px] font-medium">Welcome Jethro!</span>
          <Bell className="ml-auto h-3 w-3" strokeWidth={1.8} />
        </div>
      </Part>

      <Part mode={mode} i={1} className="left-3 right-3 top-[56px] h-[38px] rounded-md" wire={<div className="space-y-2 p-1.5"><Bar w="35%" /><Bar w="62%" className="h-[9px] !bg-black/20" /></div>}>
        <div className="pl-2">
          <p className="text-[8px] text-black/55">Total balance</p>
          <Balance film={film} />
        </div>
      </Part>

      <Part mode={mode} i={2} className="left-3 right-3 top-[102px] h-[24px] rounded-md" wire={<div className="flex h-full gap-2 p-1"><span className="flex-1 rounded border border-dashed border-black/35" /><span className="flex-1 rounded border border-dashed border-black/35" /></div>}>
        <div className="flex h-full gap-2">
          {["↑  Transfer", "+  Add Money"].map((t) => (
            <span key={t} className="grid flex-1 place-items-center rounded-[5px] text-[8px] font-medium text-white shadow-[0_2px_4px_rgba(79,141,245,0.35)]" style={{ background: BLUE }}>
              {t}
            </span>
          ))}
        </div>
      </Part>

      {/* the light panel and what sits on it */}
      <Part mode={mode} i={3} className="bottom-[40px] left-[6px] right-[6px] top-[136px] rounded-t-[14px]" wire={null}>
        <div className="h-full rounded-t-[14px] bg-[#E6EEFC]" />
      </Part>
      <Part mode={mode} i={4} className="left-[12px] right-[12px] top-[146px] h-[40px] rounded-md" wire={<div className="flex h-full gap-1.5 p-1">{[0, 1, 2, 3].map((k) => <span key={k} className="flex-1 rounded border border-dashed border-black/35" />)}</div>}>
        <div className="flex h-full gap-1.5">
          {["Expense", "Insights", "Budgets", "Save"].map((t) => (
            <span key={t} className="flex flex-1 flex-col items-center justify-center gap-1 rounded-[6px] bg-white text-[6.5px] text-black/60">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#1d1d1f]" />
              {t}
            </span>
          ))}
        </div>
      </Part>
      <Part mode={mode} i={5} className="left-4 right-4 top-[194px] h-[10px]" wire={<Bar w="40%" className="mt-[2px]" />}>
        <div className="flex items-center justify-between text-[6.5px] font-semibold tracking-[0.06em]">
          NOTIFICATIONS <span className="font-medium tracking-normal" style={{ color: BLUE }}>View all</span>
        </div>
      </Part>
      {NOTES.map(([t, s, d], k) => (
        <Part
          key={t}
          mode={mode}
          i={6 + k}
          className="left-4 right-4 h-[30px] rounded-[6px]"
          style={{ top: 212 + k * 36 }}
          wire={<div className="flex h-full items-center gap-1.5 px-1.5"><span className="h-4 w-4 rounded border border-dashed border-black/35" /><div className="flex-1 space-y-1"><Bar w="60%" /><Bar w="85%" /></div></div>}
        >
          <motion.div
            key={film ? "film" : "still"}
            initial={film ? { x: 24, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: film ? 0.9 + k * 0.25 : 0, ease: EASE }}
            className="flex h-full items-center gap-1.5 rounded-[6px] bg-white px-1.5"
          >
            <span className="h-4 w-4 shrink-0 rounded-[4px]" style={{ background: BLUE }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[7px] font-medium">{t}</span>
              <span className="block truncate text-[5.5px] text-black/50">{s}</span>
            </span>
            <span className="self-start pt-1 text-[5.5px] text-black/45">{d}</span>
          </motion.div>
        </Part>
      ))}

      <Part mode={mode} i={9} className="bottom-0 left-0 right-0 h-[38px]" wire={<div className="flex h-full items-center justify-around px-2">{[0, 1, 2, 3, 4].map((k) => <span key={k} className="h-3 w-3 rounded border border-dashed border-black/35" />)}</div>}>
        <div className="flex h-full items-center justify-around border-t border-black/5 bg-white px-1 text-[6px] text-black/60">
          {["Home", "Send", "Pay", "Insight", "More"].map((t, k) => (
            <span key={t} className={`flex flex-col items-center gap-0.5 ${k === 0 ? "font-semibold text-black" : ""}`}>
              <span className={`h-2.5 w-2.5 rounded-[3px] ${k === 0 ? "bg-black" : "border border-black/50"}`} />
              {t}
            </span>
          ))}
        </div>
      </Part>

      {/* Design: the balance is the selected layer */}
      <div
        className="pointer-events-none absolute left-3 right-3 top-[56px] h-[38px] transition-opacity duration-300"
        style={{ opacity: mode === 0 ? 1 : 0 }}
      >
        <span className="absolute inset-0 border border-accent" />
        {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map((p) => (
          <span key={p} className={`absolute h-[6px] w-[6px] border border-accent bg-white ${p}`} />
        ))}
        <span className="absolute -bottom-[15px] left-1/2 -translate-x-1/2 bg-accent px-1 text-[6.5px] font-semibold text-black">168 × 38</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- the panel */

const CODE = [
  ["<", "Home", ">"],
  ["  <", "Greeting", " name=\"Jethro\" />"],
  ["  <", "Balance", " amount={23970.98} />"],
  ["  <", "Actions", " items={actions} />"],
  ["  <", "QuickLinks", " />"],
  ["  <", "Notifications", " limit={3} />"],
  ["  <", "TabBar", " active=\"home\" />"],
  ["</", "Home", ">"],
];

function Timecode({ run }: { run: boolean }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      setF(Math.floor(((now - t0) / 1000) * 30) + 12 * 30);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  const s = Math.floor(f / 30);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="tabular-nums">
      00:00:{pad(s)}:{pad(f % 30)}
    </span>
  );
}

function Panel({ mode, onReel, cycle }: { mode: number; onReel: () => void; cycle: number }) {
  return (
    <div className="relative h-full font-mono text-[11px] leading-[1.7]">
      {/* Design: layers and spec */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: mode === 0 ? 1 : 0, pointerEvents: mode === 0 ? "auto" : "none" }}>
        <p className="label !text-[10px]">Layers</p>
        <ul className="mt-3 space-y-1 text-text-secondary">
          {["Home", "  Greeting", "  Balance", "  Actions", "  Quick links", "  Notifications", "  Tab bar"].map((l) => (
            <li key={l} className={`whitespace-pre ${l.trim() === "Balance" ? "bg-accent/40 text-text" : ""}`}>
              {l.startsWith(" ") ? "  ▫ " + l.trim() : "▪ " + l}
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-1 border-t border-border pt-4 text-text-tertiary">
          <p>Inter 700 · 17/20</p>
          <p>Fill #16A34A · Gap 8</p>
          <p>Radius 6 · Blue #4F8DF5</p>
        </div>
      </div>

      {/* Build: the code types */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: mode === 1 ? 1 : 0, pointerEvents: "none" }}>
        <p className="label !text-[10px]">Home.tsx</p>
        <div className="mt-3">
          {CODE.map(([a, tag, b], k) => (
            <motion.div
              key={`${cycle}-${k}`}
              className="flex overflow-hidden whitespace-pre"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={mode === 1 ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
              transition={{ duration: 0.32, delay: mode === 1 ? 0.15 + k * 0.32 : 0, ease: "linear" }}
            >
              <span className="w-6 shrink-0 text-right text-text-tertiary/60">{k + 1}</span>
              <span className="ml-3 text-text-tertiary">{a}</span>
              <span className="text-accent-ink">{tag}</span>
              <span className="text-text-secondary">{b}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-5 text-text-tertiary">✓ Compiled</p>
      </div>

      {/* Film: the timeline */}
      <div className="absolute inset-0 flex flex-col justify-between text-white/70 transition-opacity duration-500" style={{ opacity: mode === 2 ? 1 : 0, pointerEvents: mode === 2 ? "auto" : "none" }}>
        <div>
          <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            SabiBank · launch film
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d4d]" />
              Rec
            </span>
          </p>
          <p className="mt-3 text-[22px] text-white">
            <Timecode run={mode === 2} />
          </p>
          <ul className="mt-4 space-y-1 text-white/55">
            <li>Shot 03 · balance counts up</li>
            <li>Shot 04 · alerts slide in</li>
          </ul>
        </div>
        <div>
          <div className="relative space-y-1.5">
            <div className="flex gap-1">
              {[22, 14, 30, 18, 16].map((w, k) => (
                <span key={k} className={`h-5 rounded-[2px] ${k === 2 ? "bg-accent" : "bg-white/20"}`} style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="flex h-4 items-center gap-[2px]">
              {Array.from({ length: 44 }, (_, k) => (
                <span key={k} className="w-[2px] flex-1 bg-white/30" style={{ height: `${25 + ((k * 37) % 70)}%` }} />
              ))}
            </div>
            <motion.span
              key={`ph-${cycle}`}
              className="absolute -top-1 bottom-[-4px] w-px bg-white"
              initial={{ left: "18%" }}
              animate={mode === 2 ? { left: "92%" } : { left: "18%" }}
              transition={{ duration: CYCLE / 1000, ease: "linear" }}
            />
          </div>
          <button
            type="button"
            onClick={onReel}
            className="mt-5 inline-flex items-center gap-2 bg-accent px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5"
          >
            <Play className="h-3 w-3 fill-black" /> Watch my reel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ the hero */

export function HeroProcess({ ready, resumeUrl, onReel }: { ready: boolean; resumeUrl: string; onReel: () => void }) {
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
          Open to product design roles and freelance work
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
                    style={{ color: on ? "rgb(var(--ink-rgb))" : "#cdcdcb" }}
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
          <div className="flex h-full flex-col gap-6 p-5 sm:flex-row sm:items-stretch sm:p-6">
            <div className="order-2 h-[300px] overflow-hidden sm:order-1 sm:h-auto sm:flex-1">
              <Panel mode={step} onReel={onReel} cycle={cycle} />
            </div>
            <div className="order-1 flex shrink-0 items-center justify-center sm:order-2">
              <motion.div
                animate={film ? { scale: 1.06, rotate: -1.5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: film ? CYCLE / 1000 : 0.6, ease: film ? "linear" : EASE }}
                className={film ? "drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]" : ""}
              >
                <Screen mode={step} />
              </motion.div>
            </div>
          </div>
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
        <p className="border-b border-r border-border p-4 text-[14px] leading-[1.55] text-text-secondary">
          I&apos;m Jethro. I take products from user interviews to tested prototypes, build them in React
          and Next.js, and make the film that explains them at launch.
        </p>
        <dl className="col-span-2 grid grid-cols-3 border-b border-r border-border sm:col-span-1 sm:grid-cols-1 sm:content-center sm:gap-2 sm:p-4">
          {[
            ["60", "films made"],
            ["5", "case studies"],
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
            <a href="mailto:adebisireuel@gmail.com" className="font-semibold hover:underline">
              Email me
            </a>
          </li>
          {[
            ["LinkedIn", "https://www.linkedin.com/in/jethro-adebisi-21872a20b"],
            ["Behance", "https://www.behance.net/adebisijethro"],
            ["GitHub", "https://github.com/adebisijethro"],
          ].map(([k, href]) => (
            <li key={k}>
              <a href={href} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text">
                {k}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
