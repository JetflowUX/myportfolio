"use client";

import { useMemo, useRef, useState } from "react";
import { Dices, Download } from "lucide-react";
import { ActionButton, Group, Options, Slider } from "@/components/playground/controls";
import { downloadPng, downloadSvg, newSeed, seeded } from "@/lib/playground";

/* Shape study (2026-11-03). Jethro: "a mathematics kind of thing where you can tweak numbers and
   you give an image ... squares ... rectangles, and then circles ... they can download". A grid of
   shapes whose size, turn and colour come from one formula over the grid, written out under the
   picture as the numbers change. Saved as PNG or SVG at full size. */

type Shape = "square" | "rectangle" | "circle" | "mix";
type Pattern = "even" | "wave" | "ripple" | "diagonal" | "noise";
type ColourMode = "single" | "alternate" | "gradient" | "pattern" | "random";
type Format = "1:1" | "4:5" | "16:9";

type Params = {
  shape: Shape;
  cols: number;
  rows: number;
  size: number;
  pattern: Pattern;
  amount: number;
  frequency: number;
  turn: number;
  ratio: number;
  margin: number;
  palette: string;
  colour: ColourMode;
  outline: boolean;
  stroke: number;
  format: Format;
  seed: number;
};

const PALETTES: Record<string, { name: string; bg: string; ink: string[] }> = {
  paper: { name: "Paper", bg: "#F4F4F3", ink: ["#111111", "#00C9A0", "#59B7FF"] },
  bauhaus: { name: "Bauhaus", bg: "#F2EBDD", ink: ["#E63B2E", "#1F4E9C", "#F2B705", "#111111"] },
  midnight: { name: "Midnight", bg: "#0E1022", ink: ["#7C5CFF", "#00E0B8", "#FF5C8A", "#F4F4F3"] },
  sunset: { name: "Sunset", bg: "#FFF1E6", ink: ["#2E294E", "#EF476F", "#FF6B35", "#F7C59F"] },
  forest: { name: "Forest", bg: "#E9F0E6", ink: ["#1B4332", "#40916C", "#95D5B2"] },
  mono: { name: "Mono", bg: "#FFFFFF", ink: ["#111111"] },
};

const SIZES: Record<Format, [number, number]> = { "1:1": [1200, 1200], "4:5": [1200, 1500], "16:9": [1920, 1080] };

const START: Params = {
  shape: "circle",
  cols: 12,
  rows: 12,
  size: 0.86,
  pattern: "ripple",
  amount: 0.7,
  frequency: 0.9,
  turn: 0,
  ratio: 0.5,
  margin: 0.08,
  palette: "paper",
  colour: "pattern",
  outline: false,
  stroke: 3,
  format: "1:1",
  seed: 7,
};

const PRESETS: { name: string; params: Partial<Params> }[] = [
  { name: "Ripple", params: { shape: "circle", cols: 12, rows: 12, pattern: "ripple", amount: 0.7, frequency: 0.9, turn: 0, palette: "paper", colour: "pattern", outline: false } },
  { name: "Bauhaus", params: { shape: "mix", cols: 6, rows: 6, size: 0.9, pattern: "even", amount: 0, turn: 0, palette: "bauhaus", colour: "random", outline: false, margin: 0.06 } },
  { name: "Op art", params: { shape: "square", cols: 16, rows: 16, size: 1, pattern: "wave", amount: 0.85, frequency: 0.45, turn: 6, palette: "mono", colour: "single", outline: false } },
  { name: "Stairs", params: { shape: "rectangle", cols: 10, rows: 14, size: 1, ratio: 0.45, pattern: "diagonal", amount: 0.55, turn: 9, palette: "sunset", colour: "gradient", outline: false } },
  { name: "Wireframe", params: { shape: "square", cols: 9, rows: 9, size: 0.95, pattern: "ripple", amount: 0.6, frequency: 1.4, turn: 12, palette: "midnight", colour: "alternate", outline: true, stroke: 2 } },
];

function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

const f2 = (n: number) => n.toFixed(2).replace(/\.?0+$/, "") || "0";

export function ShapeStudy() {
  const [p, setP] = useState<Params>(START);
  const svgRef = useRef<SVGSVGElement>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Params>(key: K, value: Params[K]) => setP((prev) => ({ ...prev, [key]: value }));

  const [W, H] = SIZES[p.format];
  const pal = PALETTES[p.palette];

  const shapes = useMemo(() => {
    const rand = seeded(p.seed);
    const pad = Math.min(W, H) * p.margin;
    const cw = (W - pad * 2) / p.cols;
    const ch = (H - pad * 2) / p.rows;
    const cell = Math.min(cw, ch);
    const cx0 = (p.cols - 1) / 2;
    const cy0 = (p.rows - 1) / 2;
    const out: { x: number; y: number; w: number; h: number; angle: number; kind: "rect" | "circle"; colour: string }[] = [];

    for (let j = 0; j < p.rows; j++) {
      for (let i = 0; i < p.cols; i++) {
        // the pattern: a value from 0 to 1 for this cell
        let t = 1;
        if (p.pattern === "wave") t = 0.5 + 0.5 * Math.sin(p.frequency * (i + j));
        else if (p.pattern === "ripple") t = 0.5 + 0.5 * Math.cos(p.frequency * Math.hypot(i - cx0, j - cy0));
        else if (p.pattern === "diagonal") t = (i + j) / Math.max(1, p.cols + p.rows - 2);
        else if (p.pattern === "noise") t = rand();

        const scale = p.size * (1 - p.amount * (1 - t));
        const kind =
          p.shape === "mix" ? (["square", "rectangle", "circle"] as const)[Math.floor(rand() * 3)] : p.shape;
        const w = cell * scale;
        const h = kind === "rectangle" ? w * p.ratio : w;

        let colour = pal.ink[0];
        const n = pal.ink.length;
        if (p.colour === "alternate") colour = pal.ink[(i + j) % n];
        else if (p.colour === "gradient") colour = mix(pal.ink[0], pal.ink[n - 1], (i / Math.max(1, p.cols - 1) + j / Math.max(1, p.rows - 1)) / 2);
        else if (p.colour === "pattern") colour = pal.ink[Math.min(n - 1, Math.floor(t * n))];
        else if (p.colour === "random") colour = pal.ink[Math.floor(rand() * n)];

        out.push({
          x: pad + cw * (i + 0.5),
          y: pad + ch * (j + 0.5),
          w,
          h,
          angle: p.turn * (i + j),
          kind: kind === "circle" ? "circle" : "rect",
          colour,
        });
      }
    }
    return out;
  }, [p, W, H, pal]);

  const formula = useMemo(() => {
    const t =
      p.pattern === "even"
        ? "t = 1"
        : p.pattern === "wave"
          ? `t = ½ + ½·sin(${f2(p.frequency)} × (col + row))`
          : p.pattern === "ripple"
            ? `t = ½ + ½·cos(${f2(p.frequency)} × distance from centre)`
            : p.pattern === "diagonal"
              ? "t = (col + row) ÷ (cols + rows − 2)"
              : `t = random(seed ${p.seed})`;
    return [
      t,
      `size = ${f2(p.size)} × (1 − ${f2(p.amount)} × (1 − t)) × cell`,
      `turn = ${p.turn}° × (col + row)`,
    ];
  }, [p]);

  async function save(kind: "png" | "svg") {
    if (!svgRef.current) return;
    const name = `shape-study-${p.shape}-${p.seed}.${kind}`;
    if (kind === "svg") return downloadSvg(svgRef.current, name);
    setSaving(true);
    try {
      await downloadPng(svgRef.current, W, H, name);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="flex items-center justify-center border border-border bg-white/50 p-4 sm:p-6">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="h-auto max-h-[70vh] w-full shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]"
            role="img"
            aria-label="Your shape study"
          >
            <rect width={W} height={H} fill={pal.bg} />
            {shapes.map((s, k) => {
              const paint = p.outline
                ? { fill: "none", stroke: s.colour, strokeWidth: p.stroke }
                : { fill: s.colour };
              return s.kind === "circle" ? (
                <ellipse key={k} cx={s.x} cy={s.y} rx={s.w / 2} ry={s.h / 2} transform={`rotate(${s.angle} ${s.x} ${s.y})`} {...paint} />
              ) : (
                <rect
                  key={k}
                  x={s.x - s.w / 2}
                  y={s.y - s.h / 2}
                  width={s.w}
                  height={s.h}
                  transform={`rotate(${s.angle} ${s.x} ${s.y})`}
                  {...paint}
                />
              );
            })}
          </svg>
        </div>
        <div className="mt-4 border border-border bg-white/60 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">The formula</p>
          <div className="mt-2 space-y-1 font-mono text-[12.5px] leading-[1.6] text-text">
            {formula.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ActionButton tone="primary" onClick={() => save("png")} disabled={saving}>
            <Download className="h-4 w-4" /> {saving ? "Saving" : "Save PNG"}
          </ActionButton>
          <ActionButton onClick={() => save("svg")}>
            <Download className="h-4 w-4" /> Save SVG
          </ActionButton>
          <span className="text-[12px] text-text-tertiary">
            {W} × {H} px
          </span>
        </div>
      </div>

      <div>
        <Group title="Start from">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setP((prev) => ({ ...prev, ...preset.params }))}
                className="min-h-[34px] border border-border bg-white px-3 text-[13px] font-medium text-text-secondary transition-colors hover:border-ink hover:text-text"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Shapes">
          <Options
            value={p.shape}
            onChange={(v) => set("shape", v)}
            options={[
              { value: "square", label: "Squares" },
              { value: "rectangle", label: "Rectangles" },
              { value: "circle", label: "Circles" },
              { value: "mix", label: "Mix" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Slider label="Columns" value={p.cols} min={1} max={30} onChange={(v) => set("cols", v)} />
            <Slider label="Rows" value={p.rows} min={1} max={30} onChange={(v) => set("rows", v)} />
          </div>
          <Slider label="Size" value={p.size} min={0.1} max={1.4} step={0.01} onChange={(v) => set("size", v)} />
          {p.shape === "rectangle" || p.shape === "mix" ? (
            <Slider label="Rectangle height" value={p.ratio} min={0.1} max={1} step={0.01} onChange={(v) => set("ratio", v)} />
          ) : null}
          <Slider label="Margin" value={p.margin} min={0} max={0.25} step={0.01} onChange={(v) => set("margin", v)} />
        </Group>

        <Group title="The maths">
          <Options
            label="Pattern"
            value={p.pattern}
            onChange={(v) => set("pattern", v)}
            options={[
              { value: "even", label: "Even" },
              { value: "wave", label: "Wave" },
              { value: "ripple", label: "Ripple" },
              { value: "diagonal", label: "Diagonal" },
              { value: "noise", label: "Noise" },
            ]}
          />
          <Slider label="Strength" value={p.amount} min={0} max={1} step={0.01} onChange={(v) => set("amount", v)} />
          {p.pattern === "wave" || p.pattern === "ripple" ? (
            <Slider label="Frequency" value={p.frequency} min={0.05} max={3} step={0.05} onChange={(v) => set("frequency", v)} />
          ) : null}
          <Slider label="Turn per step" value={p.turn} min={0} max={90} onChange={(v) => set("turn", v)} suffix="°" />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Slider label="Seed" value={p.seed} min={0} max={999999} onChange={(v) => set("seed", v)} />
            </div>
            <button
              type="button"
              onClick={() => set("seed", newSeed())}
              aria-label="New random seed"
              title="New random seed"
              className="mb-1 flex h-9 w-9 items-center justify-center border border-border bg-white hover:border-ink"
            >
              <Dices className="h-4 w-4" />
            </button>
          </div>
        </Group>

        <Group title="Colour">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Palette">
            {Object.entries(PALETTES).map(([key, pl]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={p.palette === key}
                onClick={() => set("palette", key)}
                title={pl.name}
                className={`flex items-center gap-1 border p-1.5 transition-colors ${p.palette === key ? "border-ink" : "border-border hover:border-ink/50"}`}
                style={{ background: pl.bg }}
              >
                {pl.ink.map((c) => (
                  <span key={c} className="h-4 w-4 rounded-full" style={{ background: c }} />
                ))}
                <span className="sr-only">{pl.name}</span>
              </button>
            ))}
          </div>
          <Options
            label="Colour by"
            value={p.colour}
            onChange={(v) => set("colour", v)}
            options={[
              { value: "single", label: "One" },
              { value: "alternate", label: "Alternate" },
              { value: "gradient", label: "Gradient" },
              { value: "pattern", label: "Pattern" },
              { value: "random", label: "Random" },
            ]}
          />
          <Options
            label="Paint"
            value={p.outline ? "outline" : "solid"}
            onChange={(v) => set("outline", v === "outline")}
            options={[
              { value: "solid", label: "Solid" },
              { value: "outline", label: "Outline" },
            ]}
          />
          {p.outline ? <Slider label="Line width" value={p.stroke} min={1} max={12} onChange={(v) => set("stroke", v)} /> : null}
        </Group>

        <Group title="Canvas">
          <Options
            value={p.format}
            onChange={(v) => set("format", v)}
            options={[
              { value: "1:1", label: "Square", hint: "1:1" },
              { value: "4:5", label: "Portrait", hint: "4:5" },
              { value: "16:9", label: "Wide", hint: "16:9" },
            ]}
          />
        </Group>
      </div>
    </div>
  );
}
