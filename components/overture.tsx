"use client";

import { LOGO_H, LOGO_PATH, LOGO_W } from "@/components/logo-mark";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   OVERTURE (2026-11-02)

   The opening, after edisonfangworkshop.com's: on dark paper a point of light
   falls while a counter runs to 100, his mark appears and shrinks away, a
   one-point perspective room opens out from the centre, then every line
   collapses onto one flat plane while the paper folds down into a card, and
   the card says what the site is. Then the card fades and the page is there.

   Timings follow the reference (5.65 s). The geometry is drawn into one SVG
   and driven by requestAnimationFrame through refs, so React never re-renders
   during the sequence. It plays once per browser session; "Enter" skips it,
   reduced motion never sees it, and the footer can replay it.
   --------------------------------------------------------------------------- */

export const INTRO_KEY = "ja-intro-seen";
export const REPLAY_EVENT = "ja:overture-replay";

const END = 5650;
// played at 1.8x (2026-11-03: "make the opening animation cost less"): the same sequence in 3.1 s
const SPEED = 1.8;
const NS = "http://www.w3.org/2000/svg";
/* His mark: the arrow J (components/logo-mark.tsx, 2026-11-03), replacing the sigma that stood here.
   Drawn as an aqua outline, like every other line in the opening. MARK_S fits it to the height the old
   mark had (26 units of a 64-unit box). */
const MARK = LOGO_PATH;
const MARK_S = 26 / LOGO_H;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Seg = [number, number, number, number];

/** Nested rings toward the vanishing point, rays out to the outer ring, both axes. */
function room(w: number, h: number): Seg[] {
  const cx = w / 2;
  const cy = h / 2;
  const scales = [0.07, 0.115, 0.18, 0.27, 0.39, 0.54, 0.74, 1];
  const rings = scales.map((s) => ({ l: cx - (cx - 0.5) * s, r: cx + (cx - 0.5) * s, t: cy - (cy - 0.5) * s, b: cy + (cy - 0.5) * s }));
  const segs: Seg[] = [];
  for (const g of rings) {
    segs.push([g.l, g.t, g.r, g.t], [g.r, g.t, g.r, g.b], [g.r, g.b, g.l, g.b], [g.l, g.b, g.l, g.t]);
  }
  const o = rings[rings.length - 1];
  const div = 8;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < div; i++) {
      if (i === div / 2) continue; // the axes draw these
      const t = i / div;
      const p =
        side === 0 ? [o.l + (o.r - o.l) * t, o.t]
        : side === 1 ? [o.r, o.t + (o.b - o.t) * t]
        : side === 2 ? [o.r - (o.r - o.l) * t, o.b]
        : [o.l, o.b - (o.b - o.t) * t];
      segs.push([cx, cy, p[0], p[1]]);
    }
  }
  segs.push([cx, 0, cx, h], [0, cy, w, cy]);
  return segs;
}

export function Overture({ onFinish }: { onFinish: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState<"play" | "leave" | "gone">("play");
  const [round, setRound] = useState(0);
  const run = useRef<{ start: number; raf: number; done: boolean } | null>(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const close = useCallback(() => {
    if (run.current?.done) return;
    if (run.current) {
      run.current.done = true;
      cancelAnimationFrame(run.current.raf);
    }
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    finishRef.current();
    setPhase("leave");
    window.setTimeout(() => {
      document.documentElement.dataset.intro = "skip";
      setPhase("gone");
    }, 700);
  }, []);

  const play = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const $ = (id: string) => svg.querySelector<SVGElement>(`[data-id="${id}"]`)!;
    const set = (el: Element, v: Record<string, string | number>) => {
      for (const k in v) el.setAttribute(k, String(v[k]));
    };
    const grid = $("grid");
    grid.replaceChildren();

    let w = 0, h = 0, pw = 0, ph = 0, px = 0, py = 0;
    let segs: Seg[] = [];
    const lines: SVGLineElement[] = [];

    const layout = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      if (w > h) {
        pw = Math.min(w * 0.91, h * 0.72 * 1.5, 980);
        ph = pw / 1.5;
      } else {
        pw = Math.min(w * 0.74, h * 0.43, 365);
        ph = pw * 1.4;
      }
      px = (w - pw) / 2;
      py = (h - ph) / 2;
      segs = room(w, h);
      while (lines.length < segs.length) {
        const el = document.createElementNS(NS, "line");
        grid.appendChild(el);
        lines.push(el);
      }
    };

    const render = (ms: number) => {
      const count = clamp(ms / 1650);
      const exit = ease((ms - 1750) / 450);
      const flatten = ease((ms - 4000) / 800);
      const shrink = ease((ms - 4200) / 850);
      const x = mix(0, px, shrink);
      const y = mix(0, py, shrink);
      const ww = mix(w, pw, shrink);
      const hh = mix(h, ph, shrink);
      set($("paper"), { x, y, width: ww, height: hh });

      // every line lands on one of the four edges of the plane inside the card
      const plane: Seg[] =
        w > h
          ? [[0.105, 0.23, 0.86, 0.23], [0.86, 0.23, 0.86, 0.49], [0.86, 0.49, 0.105, 0.49], [0.105, 0.49, 0.105, 0.23]]
          : [[0.23, 0.29, 0.76, 0.23], [0.76, 0.23, 0.76, 0.43], [0.76, 0.43, 0.23, 0.49], [0.23, 0.49, 0.23, 0.29]];
      segs.forEach((seg, i) => {
        const dest = plane[i % 4];
        const delay = i < 32 ? Math.floor(i / 4) * 28 : i < 60 ? 65 : 0;
        const open = ease((ms - 2600 - delay) / 750);
        const c = seg.map((v, j) => {
          const dim = j % 2 ? h : w;
          const flat = mix(mix(dim / 2, v, open), dest[j] * dim, flatten);
          return j % 2 ? y + (flat / h) * hh : x + (flat / w) * ww;
        });
        set(lines[i], { x1: c[0], y1: c[1], x2: c[2], y2: c[3], opacity: open * mix(0.64, i < 4 ? 0.48 : 0, flatten) });
      });

      // the light falls while the counter runs
      const top = h * 0.36;
      const tip = h * (0.36 + 0.28 * count);
      const num = $("number");
      num.textContent = String(Math.round(count * 100)).padStart(3, "0");
      set(num, { x: w / 2, y: tip + 26 });
      set($("count"), { opacity: 1 - exit });
      set($("spine"), { x1: w / 2, x2: w / 2, y1: mix(top, tip, exit), y2: tip, opacity: 0.13 * (1 - exit) });
      set($("light"), { x1: w / 2, x2: w / 2, y1: tip - 18, y2: tip, opacity: 1 - exit });
      set($("halo"), { x1: w / 2, x2: w / 2, y1: tip - 18, y2: tip, opacity: 0.4 * (1 - exit) });

      // his mark: in at the centre, then shrinks into the vanishing point
      const out = ease((ms - 2450) / 300);
      const k = (Math.min(w * 0.2, 110) / 18) * (1 - 0.94 * out);
      set($("entry"), {
        transform: `translate(${w / 2 - (LOGO_W / 2) * MARK_S * k},${h / 2 - (LOGO_H / 2) * MARK_S * k}) scale(${k * MARK_S})`,
        opacity: ease((ms - 1750) / 300) * (1 - out),
      });

      // the card
      const m = ww * 0.105;
      set($("poster"), { opacity: ease((ms - 4600) / 450) });
      set($("brand"), { x: x + m, y: y + hh * 0.095, "font-size": ww * 0.023 });
      set($("line1"), { x: x + m, y: y + hh * 0.68, "font-size": ww * 0.098 });
      set($("line2"), { x: x + m, y: y + hh * 0.81, "font-size": ww * 0.098 });
      set($("caption"), { x: x + m, y: y + hh * 0.935, "font-size": ww * 0.022 });
      // the card's mark: at least 22 px tall, so it stays a J on a phone-sized card
      const mk = Math.max(ww / 700, 22 / 26);
      set($("mark"), { transform: `translate(${x + ww * 0.8 + 24 * mk},${y + hh * 0.83 + 18 * mk - (mk - ww / 700) * 26}) scale(${mk * MARK_S})` });
    };

    layout();
    render(0);
    const onResize = () => {
      layout();
      if (run.current) render(performance.now() - run.current.start);
    };
    window.addEventListener("resize", onResize);

    const state = { start: performance.now(), raf: 0, done: false };
    run.current = state;
    const tick = (now: number) => {
      if (state.done) return;
      const ms = (now - state.start) * SPEED;
      render(ms);
      if (ms >= END) {
        window.removeEventListener("resize", onResize);
        close();
      } else state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
    return () => window.removeEventListener("resize", onResize);
  }, [close]);

  // first entry: the head script in app/layout decided whether this session
  // plays it; later rounds come from the footer's replay
  useEffect(() => {
    if (round === 0 && document.documentElement.dataset.intro !== "play") {
      setPhase("gone");
      onFinish();
      return;
    }
    const stop = play();
    return () => {
      stop?.();
      if (run.current) {
        run.current.done = true;
        cancelAnimationFrame(run.current.raf);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    const replay = () => {
      document.documentElement.dataset.intro = "play";
      window.scrollTo({ top: 0 });
      run.current = null;
      setPhase("play");
      setRound((r) => r + 1);
    };
    window.addEventListener(REPLAY_EVENT, replay);
    return () => window.removeEventListener(REPLAY_EVENT, replay);
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  if (phase === "gone") return null;

  return (
    <div
      className="overture fixed inset-0 z-[100] bg-bg transition-opacity duration-700 ease-out"
      style={{ opacity: phase === "leave" ? 0 : 1, pointerEvents: phase === "leave" ? "none" : "auto" }}
    >
      <svg ref={svgRef} className="block h-full w-full select-none" aria-hidden>
        <rect data-id="paper" fill="#111110" width="100%" height="100%" />
        <g data-id="grid" fill="none" stroke="#eeeee7" strokeWidth={0.8} />
        <defs>
          <filter id="overture-glow" x="-300%" y="-100%" width="700%" height="300%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>
        <line data-id="spine" stroke="#eeeee7" strokeWidth={0.8} />
        <line data-id="halo" stroke="#eeeee7" strokeWidth={3} filter="url(#overture-glow)" />
        <line data-id="light" stroke="#fffef5" strokeWidth={1.1} />
        <g data-id="count" fill="#eeeee7">
          <text data-id="number" textAnchor="middle" fontSize={14} style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.03em" }}>
            000
          </text>
        </g>
        <path data-id="entry" d={MARK} fill="none" stroke="#00FFC2" strokeWidth={1.2} vectorEffect="non-scaling-stroke" opacity={0} />
        <g data-id="poster" fill="#eeeee7" opacity={0}>
          <text data-id="brand" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
            JETHRO ADEBISI
          </text>
          <text data-id="line1" style={{ fontFamily: "'Instrument Serif', Baskerville, serif", letterSpacing: "-0.02em" }}>
            Design it,
          </text>
          <text data-id="line2" style={{ fontFamily: "'Instrument Serif', Baskerville, serif", letterSpacing: "-0.02em" }}>
            then build it.
          </text>
          <text data-id="caption" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
            JA / PORTFOLIO
          </text>
          {/* solid, not an outline: an outline this small blurs into a smudge */}
          <path data-id="mark" d={MARK} fill="#00FFC2" />
        </g>
      </svg>
      <button
        type="button"
        onClick={close}
        className="fixed bottom-[max(22px,env(safe-area-inset-bottom))] right-[max(22px,env(safe-area-inset-right))] min-h-11 min-w-11 px-1 py-2.5 font-mono text-sm text-white mix-blend-difference"
      >
        Enter
      </button>
      <span className="sr-only" role="status">
        Opening Jethro Adebisi&apos;s portfolio.
      </span>
    </div>
  );
}
