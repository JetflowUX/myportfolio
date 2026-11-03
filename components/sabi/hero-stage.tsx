"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HOME_PARTS, SabiHome } from "@/components/sabi/home-screen";

/* ---------------------------------------------------------------------------
   SABIBANK IN THE HERO (2026-11-02)

   Jethro shared his SABI APP Figma file (ju94NCZnzzpVBgUnrNWlb7) so the hero's
   Design and Build steps show the real thing rather than a stand-in.

   Design it. The Figma exports themselves (public/sabi/figma-*.png): the
   "Homepage wireframe" frame (3:216), which then becomes the finished
   "Homepage/Landing Screen" (36:3499). The Balance frame is selected at its
   real size (380 x 95 at 16, 104), and the panel lists the file's own layer
   names and values.

   Build it. The home screen rebuilt in code (components/sabi/home-screen.tsx)
   assembles part by part, in the same order the code types beside it. The
   code lines are excerpts of that file.
   --------------------------------------------------------------------------- */

const SCALE = 200 / 412;

/** The phone, at the hero's size: a 412 x 892 screen scaled into a bezel. */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border-[5px] border-[#B9C0CB] bg-white" style={{ width: 200 + 10, height: 892 * SCALE + 10 }}>
      <div style={{ width: 412, height: 892, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}

function Figma({ hifi }: { hifi: boolean }) {
  return (
    <Phone>
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sabi/figma-home-wireframe.png" alt="SabiBank home wireframe, from the Figma file" width={412} height={892} className="absolute inset-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sabi/figma-home.png"
          alt="SabiBank home screen, from the Figma file"
          width={412}
          height={892}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: hifi ? 1 : 0 }}
        />
        {/* the selected layer: Balance, 380 x 95 at 16, 104 */}
        <div className="pointer-events-none absolute" style={{ left: 16, top: 104, width: 380, height: 95 }}>
          <span className="absolute inset-0 border-2 border-[#0D99FF]" />
          {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-left-[5px] -bottom-[5px]", "-right-[5px] -bottom-[5px]"].map((p) => (
            <span key={p} className={`absolute h-[10px] w-[10px] border-2 border-[#0D99FF] bg-white ${p}`} />
          ))}
          <span className="absolute -bottom-[30px] left-1/2 -translate-x-1/2 rounded-[3px] bg-[#0D99FF] px-2 py-0.5 text-[15px] font-semibold text-white">380 × 95</span>
        </div>
      </div>
    </Phone>
  );
}

function Built({ cycle }: { cycle: number }) {
  // one part every 260 ms, matching the code typing beside it
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = window.setInterval(() => setN((v) => (v >= HOME_PARTS.length ? v : v + 1)), 260);
    return () => window.clearInterval(id);
  }, [cycle]);
  return (
    <Phone>
      <SabiHome
        part={(i) => ({
          opacity: i < n ? 1 : 0,
          transform: i < n ? "none" : "translateY(10px)",
          transition: "opacity 420ms cubic-bezier(.22,1,.36,1), transform 520ms cubic-bezier(.22,1,.36,1)",
        })}
      />
    </Phone>
  );
}

export function SabiStage({ mode, cycle }: { mode: number; cycle: number }) {
  // in Design, the wireframe holds, then the finished design takes its place
  const [hifi, setHifi] = useState(false);
  useEffect(() => {
    setHifi(false);
    if (mode !== 0) return;
    const id = window.setTimeout(() => setHifi(true), 2100);
    return () => window.clearTimeout(id);
  }, [mode, cycle]);
  return mode === 0 ? <Figma hifi={hifi} /> : <Built cycle={cycle} />;
}

/* ---------------------------------------------------------------- the panel */

const LAYERS = [
  ["Homepage/Landing Screen", 0],
  ["status bar", 1],
  ["Frame 7", 1],
  ["Balance", 1],
  ["top  bar", 1],
  ["Frame 8", 1],
  ["Frame 26085525", 1],
  ["Group 26086160", 1],
  ["Navigation bar", 1],
] as const;

const CODE: [string, string][] = [
  ["// Balance", "c"],
  ["<Abs x={44} y={141}>", "t"],
  ["  $ {m.whole}.{m.cents}", "s"],
  ["</Abs>", "t"],
  ["// top bar: Transfer, Add Money", "c"],
  ["<Abs x={16} y={215} w={180} />", "t"],
  ["// Frame 8: four categories", "c"],
  ["{CATEGORIES.map(Category)}", "t"],
  ["// Messages", "c"],
  ["{MESSAGES.map(Message)}", "t"],
];

export function SabiPanel({ mode, cycle }: { mode: number; cycle: number }) {
  return (
    <div className="relative h-full font-mono text-[11px] leading-[1.7]">
      {/* Design: the Figma file's own layers and values */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: mode === 0 ? 1 : 0, pointerEvents: mode === 0 ? "auto" : "none" }}>
        <p className="label !text-[10px]">Figma · SABI APP · Layers</p>
        <ul className="mt-3 space-y-1 text-text-secondary">
          {LAYERS.map(([name, depth]) => (
            <li key={name} className={`truncate ${name === "Balance" ? "bg-[#0D99FF]/15 text-text" : ""}`} style={{ paddingLeft: depth * 14 }}>
              {depth ? "▫ " : "▪ "}
              {name}
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-1 border-t border-border pt-4 text-text-tertiary">
          <p>Balance · 380 × 95 · x 16 y 104</p>
          <p>$ 23,970.98 · Poppins 24 · #219653</p>
          <p>Button · 180 × 40 · #4285F4</p>
        </div>
      </div>

      {/* Build: the code types, part by part */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: mode === 1 ? 1 : 0, pointerEvents: "none" }}>
        <p className="label !text-[10px]">home-screen.tsx</p>
        <div className="mt-3">
          {CODE.map(([line, kind], k) => (
            <motion.div
              key={`${cycle}-${k}`}
              className="flex overflow-hidden whitespace-pre"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={mode === 1 ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
              transition={{ duration: 0.22, delay: mode === 1 ? 0.1 + k * 0.26 : 0, ease: "linear" }}
            >
              <span className="w-6 shrink-0 text-right text-text-tertiary/60">{k + 1}</span>
              <span className={`ml-3 truncate ${kind === "c" ? "text-text-tertiary" : kind === "s" ? "text-[#219653]" : "text-accent-ink"}`}>{line}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-text-tertiary">✓ Compiled</p>
      </div>
    </div>
  );
}

