"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";

/* ---------------------------------------------------------------------------
   MOTION GRAPH (2026-11-02, SabiBank from 2026-11-03)

   The hero's third step, "Film it.". A cut of a film plays above a graph editor
   whose curves are that film's real tracks (same keyframes, same easing, read
   from its Remotion source), with the playhead driven by the video's own clock:
   when a value moves on screen, its curve moves under the playhead on the same
   frame. Jethro first chose this editor with the Allophone study, then asked
   for a real SabiBank film so the hero is one product, designed, built, filmed.

   The cut is frames 685 to 845 of ads/sabibank SabiLaunch (the budget shot):
     Camera · x          the stage's travel, EASE.cam (.48, .1, 0, .9), 34 f
     Budget · fill       the bars filling, EASE.arrive (.16, 1, .3, 1)
     Left to spend · $   2,550 counting down to 738, the same curve
   --------------------------------------------------------------------------- */

const START = 685;
const END = 845;
const FPS = 30;

/** A CSS cubic-bezier as a function of progress, as Remotion's Easing.bezier is. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  return (t: number) => {
    let s = t;
    for (let i = 0; i < 10; i++) {
      const x = 3 * (1 - s) ** 2 * s * x1 + 3 * (1 - s) * s * s * x2 + s ** 3 - t;
      if (Math.abs(x) < 1e-6) break;
      const dx = 3 * (1 - s) ** 2 * x1 + 6 * (1 - s) * s * (x2 - x1) + 3 * s * s * (1 - x2);
      if (!dx) break;
      s = Math.min(1, Math.max(0, s - x / dx));
    }
    return 3 * (1 - s) ** 2 * s * y1 + 3 * (1 - s) * s * s * y2 + s ** 3;
  };
}
const ARRIVE = bezier(0.16, 1, 0.3, 1);
const CAM = bezier(0.48, 0.1, 0, 0.9);

type Track = { name: string; ease: string; color: string; fs: number[]; vs: number[]; curve?: (t: number) => number };

const TRACKS: Track[] = [
  { name: "Camera · x", ease: "cam · .48, .1, 0, .9", color: "#59B7FF", fs: [685, 719], vs: [1920, 3620], curve: CAM },
  { name: "Budget · fill", ease: "arrive · .16, 1, .3, 1", color: "#7B61FF", fs: [730, 790], vs: [0, 100], curve: ARRIVE },
  { name: "Left to spend · $", ease: "arrive · .16, 1, .3, 1", color: "#219653", fs: [730, 790], vs: [2550, 738], curve: ARRIVE },
];

function value(tr: Track, f: number) {
  const { fs, vs } = tr;
  if (f <= fs[0]) return vs[0];
  if (f >= fs[fs.length - 1]) return vs[vs.length - 1];
  let i = 0;
  while (f > fs[i + 1]) i++;
  const p = (f - fs[i]) / (fs[i + 1] - fs[i]);
  return vs[i] + (vs[i + 1] - vs[i]) * (tr.curve ? tr.curve(p) : p);
}

/** Graph geometry for a box of W x H px, so diamonds and type are never stretched. */
function geometry(W: number, H: number) {
  const x = (f: number) => ((f - START) / (END - START)) * W;
  const y = (tr: Track, v: number) => {
    const lo = Math.min(...tr.vs);
    const hi = Math.max(...tr.vs);
    return H - 8 - ((v - lo) / (hi - lo || 1)) * (H - 22);
  };
  const paths = TRACKS.map((tr) => {
    let d = "";
    for (let f = START; f <= END; f += 0.5) d += `${d ? "L" : "M"}${x(f).toFixed(1)},${y(tr, value(tr, f)).toFixed(1)}`;
    return d;
  });
  return { x, y, paths };
}

export function MotionGraph({ onOpen }: { onOpen: () => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [f, setF] = useState(reduce ? END : START);
  const svg = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState({ W: 520, H: 84 });
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ W: Math.max(1, e.contentRect.width), H: Math.max(1, e.contentRect.height) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { W, H } = box;
  const { x, y, paths } = useMemo(() => geometry(W, H), [W, H]);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
    let raf = 0;
    const tick = () => {
      setF(Math.min(END, START + v.currentTime * FPS));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const frame = Math.floor(f);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex h-full flex-col gap-3 text-white">
      <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
        <video
          ref={ref}
          src="/films/loop/sabi-launch.mp4"
          poster="/films/poster/sabi-launch.jpg"
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2.5 top-2.5 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
          SabiBank · launch film
        </span>
        <span className="absolute right-2.5 top-2.5 hidden bg-black/70 px-2 py-1 font-mono text-[10px] tabular-nums sm:block">
          00:00:{pad(Math.floor(frame / FPS))}:{pad(frame % FPS)} · f{frame}
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-accent px-2 py-1.5 sm:bottom-2.5 sm:right-2.5 sm:gap-2 sm:px-3 sm:py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5"
        >
          <Play className="h-3 w-3 fill-black" />
          <span className="hidden sm:inline">Watch the full film</span>
          <span className="sm:hidden">Watch</span>
        </button>
      </div>

      {/* the graph editor */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 border border-white/10 bg-[#161615] p-2.5 sm:flex-row sm:gap-3">
        <ul className="grid shrink-0 grid-cols-3 gap-2 font-mono text-[9.5px] leading-tight sm:block sm:w-[170px] sm:space-y-1.5">
          {TRACKS.map((tr) => (
            <li key={tr.name}>
              <span className="flex items-center gap-1.5 text-white/85">
                <span className="h-2 w-2 shrink-0" style={{ background: tr.color }} />
                {tr.name}
                <span className="ml-auto tabular-nums text-white">{Math.round(value(tr, f))}</span>
              </span>
              <span className="hidden pl-3.5 text-white/40 sm:block">{tr.ease}</span>
            </li>
          ))}
        </ul>
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="h-[96px] w-full min-w-0 flex-1 sm:h-full sm:min-h-[80px]" aria-hidden>
          {[160, 180, 200, 220, 240].map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={0} y2={H} stroke="rgb(255 255 255 / 0.07)" />
              <text x={x(t) + 3} y={9} fill="rgb(255 255 255 / 0.35)" fontSize={7} fontFamily="'Space Mono', monospace">
                {t}
              </text>
            </g>
          ))}
          {TRACKS.map((tr, i) => (
            <g key={tr.name}>
              <path d={paths[i]} fill="none" stroke={tr.color} strokeWidth={1.4} opacity={0.9} />
              {tr.fs.map((k) => (
                <rect
                  key={k}
                  x={x(k) - 2.2}
                  y={y(tr, value(tr, k)) - 2.2}
                  width={4.4}
                  height={4.4}
                  transform={`rotate(45 ${x(k)} ${y(tr, value(tr, k))})`}
                  fill={f >= k ? tr.color : "#161615"}
                  stroke={tr.color}
                  strokeWidth={1}
                 
                />
              ))}
              <circle cx={x(f)} cy={y(tr, value(tr, f))} r={2.6} fill="#fff" />
            </g>
          ))}
          <line x1={x(f)} x2={x(f)} y1={0} y2={H} stroke="#fff" strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
}
