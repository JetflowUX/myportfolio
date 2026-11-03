"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Copy, Dices, Download, FileJson, Lock, Unlock } from "lucide-react";
import { ActionButton, Group } from "@/components/playground/controls";
import { downloadJson, downloadPng, downloadSvg, newSeed, seeded } from "@/lib/playground";

/* Token maker (2026-11-03). Jethro: "an NFT maker where they can create an NFT image they can save
   ... I don't know if I can link this to Cardano ... build this for now. We'll iterate on that
   later." A character drawn from nine traits, each with a weight, so a roll gives a rarity. It
   saves the PNG and its metadata in Cardano's NFT format (CIP-25, label 721), so minting later
   means uploading the image to IPFS and filling in the policy id; nothing here touches a wallet. */

type Option = { name: string; weight: number; colour?: string };
type TraitKey = "background" | "pattern" | "head" | "skin" | "eyes" | "mouth" | "headwear" | "accessory" | "top";

const TRAITS: Record<TraitKey, { label: string; options: Option[] }> = {
  background: {
    label: "Background",
    options: [
      { name: "Mint", weight: 20, colour: "#BDF5E4" },
      { name: "Sky", weight: 20, colour: "#BFE3FF" },
      { name: "Peach", weight: 18, colour: "#FFD6C2" },
      { name: "Lilac", weight: 16, colour: "#DCCCFF" },
      { name: "Lemon", weight: 14, colour: "#FFF1A8" },
      { name: "Night", weight: 8, colour: "#16182B" },
      { name: "Gold", weight: 4, colour: "#F2C14E" },
    ],
  },
  pattern: {
    label: "Pattern",
    options: [
      { name: "None", weight: 40 },
      { name: "Dots", weight: 25 },
      { name: "Rays", weight: 20 },
      { name: "Grid", weight: 15 },
    ],
  },
  head: {
    label: "Head",
    options: [
      { name: "Round", weight: 35 },
      { name: "Square", weight: 30 },
      { name: "Tall", weight: 20 },
      { name: "Hex", weight: 15 },
    ],
  },
  skin: {
    label: "Skin",
    options: [
      { name: "Deep", weight: 17, colour: "#5A3825" },
      { name: "Brown", weight: 17, colour: "#8D5A3B" },
      { name: "Tan", weight: 17, colour: "#C68B59" },
      { name: "Light", weight: 17, colour: "#E8B98F" },
      { name: "Pale", weight: 17, colour: "#F6D7C3" },
      { name: "Alien", weight: 10, colour: "#8BD17C" },
      { name: "Chrome", weight: 5, colour: "#C9D1DA" },
    ],
  },
  eyes: {
    label: "Eyes",
    options: [
      { name: "Dots", weight: 30 },
      { name: "Wide", weight: 25 },
      { name: "Sleepy", weight: 15 },
      { name: "Wink", weight: 15 },
      { name: "Visor", weight: 10 },
      { name: "Laser", weight: 5 },
    ],
  },
  mouth: {
    label: "Mouth",
    options: [
      { name: "Smile", weight: 30 },
      { name: "Grin", weight: 20 },
      { name: "Flat", weight: 20 },
      { name: "Tongue", weight: 15 },
      { name: "O", weight: 15 },
    ],
  },
  headwear: {
    label: "Headwear",
    options: [
      { name: "None", weight: 30 },
      { name: "Cap", weight: 20 },
      { name: "Beanie", weight: 18 },
      { name: "Antenna", weight: 14 },
      { name: "Halo", weight: 10 },
      { name: "Crown", weight: 8 },
    ],
  },
  accessory: {
    label: "Accessory",
    options: [
      { name: "None", weight: 40 },
      { name: "Earring", weight: 20 },
      { name: "Glasses", weight: 18 },
      { name: "Shades", weight: 15 },
      { name: "Monocle", weight: 7 },
    ],
  },
  top: {
    label: "Top",
    options: [
      { name: "Tee", weight: 35 },
      { name: "Hoodie", weight: 25 },
      { name: "Turtleneck", weight: 25 },
      { name: "Suit", weight: 15 },
    ],
  },
};

const ORDER = Object.keys(TRAITS) as TraitKey[];
type Traits = Record<TraitKey, string>;

const TOP_COLOURS = ["#111111", "#1F4E9C", "#E63B2E", "#00A889", "#7C5CFF", "#F28C28"];
const EYEWEAR = ["Glasses", "Shades", "Monocle"];

function pick(options: Option[], r: number) {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let x = r * total;
  for (const o of options) {
    x -= o.weight;
    if (x < 0) return o.name;
  }
  return options[options.length - 1].name;
}

function roll(seed: number, keep: Partial<Traits>): Traits {
  const rand = seeded(seed);
  const t = {} as Traits;
  for (const k of ORDER) {
    const r = rand();
    t[k] = keep[k] ?? pick(TRAITS[k].options, r);
  }
  // a visor already covers the eyes, so a rolled pair of glasses would sit on top of it
  if (t.eyes === "Visor" && !keep.accessory && EYEWEAR.includes(t.accessory)) t.accessory = "None";
  return t;
}

function chance(k: TraitKey, name: string) {
  const opts = TRAITS[k].options;
  const total = opts.reduce((s, o) => s + o.weight, 0);
  return (opts.find((o) => o.name === name)?.weight ?? 0) / total;
}

function rarity(t: Traits) {
  const score = ORDER.reduce((s, k) => s - Math.log2(chance(k, t[k]) || 1), 0);
  const tier = score < 18 ? "Common" : score < 21 ? "Uncommon" : score < 24 ? "Rare" : score < 27 ? "Epic" : "Legendary";
  // one in how many: the product of the chances
  const oneIn = Math.round(2 ** score);
  return { score, tier, oneIn };
}

const colourOf = (k: TraitKey, name: string) => TRAITS[k].options.find((o) => o.name === name)?.colour ?? "#000";

/* ------------------------------------------------------------- drawing */

function shade(hex: string, amount: number) {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `#${n.map((v) => Math.max(0, Math.min(255, Math.round(v * (1 + amount)))).toString(16).padStart(2, "0")).join("")}`;
}

function Token({ t, topColour, svgRef }: { t: Traits; topColour: string; svgRef?: React.Ref<SVGSVGElement> }) {
  const bg = colourOf("background", t.background);
  const dark = t.background === "Night";
  const skin = colourOf("skin", t.skin);
  const skinDark = shade(skin, -0.18);
  const line = t.skin === "Deep" ? "#1A0F08" : "#111111";
  const motif = dark ? "#FFFFFF" : "#111111";
  const headTop = t.head === "Tall" ? 250 : 292;
  const lift = headTop - 292;

  const headFill = t.skin === "Chrome" ? "url(#tk-chrome)" : skin;
  const head =
    t.head === "Round" ? (
      <ellipse cx={500} cy={497} rx={192} ry={205} fill={headFill} />
    ) : t.head === "Square" ? (
      <rect x={310} y={292} width={380} height={410} rx={64} fill={headFill} />
    ) : t.head === "Tall" ? (
      <rect x={334} y={250} width={332} height={462} rx={150} fill={headFill} />
    ) : (
      <polygon points="500,292 690,388 690,606 500,702 310,606 310,388" fill={headFill} strokeLinejoin="round" stroke={headFill} strokeWidth={28} />
    );

  return (
    <svg ref={svgRef} viewBox="0 0 1000 1000" width={1000} height={1000} role="img" aria-label="Your token" className="h-auto w-full">
      <defs>
        <clipPath id="tk-frame">
          <rect width={1000} height={1000} />
        </clipPath>
        <linearGradient id="tk-chrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F7FA" />
          <stop offset="0.5" stopColor="#A9B4C0" />
          <stop offset="1" stopColor="#E6EBF0" />
        </linearGradient>
      </defs>
      <g clipPath="url(#tk-frame)">
        <rect width={1000} height={1000} fill={bg} />

        {/* pattern */}
        {t.pattern === "Dots"
          ? Array.from({ length: 11 }).flatMap((_, j) =>
              Array.from({ length: 11 }).map((__, i) => (
                <circle key={`${i}-${j}`} cx={45 + i * 91} cy={45 + j * 91} r={7} fill={motif} opacity={0.12} />
              )),
            )
          : null}
        {t.pattern === "Rays"
          ? Array.from({ length: 18 }).map((_, k) => {
              const a1 = (k / 18) * Math.PI * 2;
              const a2 = a1 + Math.PI / 18;
              return (
                <polygon
                  key={k}
                  points={`500,470 ${500 + 1200 * Math.cos(a1)},${470 + 1200 * Math.sin(a1)} ${500 + 1200 * Math.cos(a2)},${470 + 1200 * Math.sin(a2)}`}
                  fill={motif}
                  opacity={0.07}
                />
              );
            })
          : null}
        {t.pattern === "Grid"
          ? Array.from({ length: 15 }).map((_, k) => (
              <g key={k} stroke={motif} strokeOpacity={0.1} strokeWidth={2}>
                <line x1={k * 71.4} y1={0} x2={k * 71.4} y2={1000} />
                <line x1={0} y1={k * 71.4} x2={1000} y2={k * 71.4} />
              </g>
            ))
          : null}

        {/* halo sits behind the head */}
        {t.headwear === "Halo" ? (
          <ellipse cx={500} cy={headTop - 40} rx={150} ry={36} fill="none" stroke="#F2C14E" strokeWidth={22} />
        ) : null}

        {/* body */}
        <rect x={452} y={660} width={96} height={170} fill={skinDark} />
        {t.top === "Hoodie" ? (
          <path d="M 250 1000 C 250 820 340 770 500 770 C 660 770 750 820 750 1000 Z" fill={topColour} />
        ) : null}
        <path
          d="M 230 1000 C 230 860 330 800 500 800 C 670 800 770 860 770 1000 Z"
          fill={t.top === "Suit" ? "#1C1F2A" : topColour}
        />
        {t.top === "Suit" ? (
          <>
            <path d="M 440 800 L 500 930 L 560 800 Z" fill="#FFFFFF" />
            <path d="M 500 840 L 486 880 L 500 960 L 514 880 Z" fill="#E63B2E" />
            <path d="M 430 802 L 470 900 L 420 880 Z M 570 802 L 530 900 L 580 880 Z" fill="#2C3142" />
          </>
        ) : null}
        {t.top === "Turtleneck" ? <rect x={430} y={740} width={140} height={90} rx={40} fill={shade(topColour, -0.12)} /> : null}
        {t.top === "Hoodie" ? (
          <g stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.85}>
            <line x1={465} y1={815} x2={460} y2={905} />
            <line x1={535} y1={815} x2={540} y2={905} />
          </g>
        ) : null}
        {t.top === "Tee" ? <path d="M 448 800 Q 500 850 552 800" fill="none" stroke={shade(topColour, -0.25)} strokeWidth={10} /> : null}

        {/* ears, then the head */}
        <circle cx={t.head === "Tall" ? 330 : 308} cy={520} r={36} fill={skinDark} />
        <circle cx={t.head === "Tall" ? 670 : 692} cy={520} r={36} fill={skinDark} />
        {head}
        {t.skin === "Chrome" ? (
          <ellipse cx={430} cy={380} rx={60} ry={26} fill="#FFFFFF" opacity={0.55} transform="rotate(-25 430 380)" />
        ) : null}

        {/* eyes */}
        {t.eyes === "Dots" ? (
          <g fill={line}>
            <circle cx={430} cy={480} r={20} />
            <circle cx={570} cy={480} r={20} />
          </g>
        ) : null}
        {t.eyes === "Wide" ? (
          <g>
            <ellipse cx={430} cy={480} rx={40} ry={34} fill="#FFFFFF" />
            <ellipse cx={570} cy={480} rx={40} ry={34} fill="#FFFFFF" />
            <circle cx={440} cy={484} r={16} fill={line} />
            <circle cx={580} cy={484} r={16} fill={line} />
          </g>
        ) : null}
        {t.eyes === "Sleepy" ? (
          <g fill="none" stroke={line} strokeWidth={11} strokeLinecap="round">
            <path d="M 400 482 Q 430 500 460 482" />
            <path d="M 540 482 Q 570 500 600 482" />
          </g>
        ) : null}
        {t.eyes === "Wink" ? (
          <g>
            <circle cx={430} cy={480} r={20} fill={line} />
            <path d="M 540 486 Q 570 462 600 486" fill="none" stroke={line} strokeWidth={11} strokeLinecap="round" />
          </g>
        ) : null}
        {t.eyes === "Visor" ? (
          <g>
            <rect x={350} y={440} width={300} height={84} rx={42} fill="#111111" />
            <rect x={372} y={462} width={256} height={14} rx={7} fill="#00FFC2" opacity={0.9} />
          </g>
        ) : null}
        {t.eyes === "Laser" ? (
          <g>
            <g stroke="#FF2E4D" strokeWidth={16} strokeLinecap="round" opacity={0.9}>
              <line x1={430} y1={480} x2={1000} y2={560} />
              <line x1={570} y1={480} x2={1000} y2={530} />
            </g>
            <circle cx={430} cy={480} r={24} fill="#FF2E4D" />
            <circle cx={570} cy={480} r={24} fill="#FF2E4D" />
            <circle cx={430} cy={480} r={10} fill="#FFFFFF" />
            <circle cx={570} cy={480} r={10} fill="#FFFFFF" />
          </g>
        ) : null}

        {/* mouth */}
        {t.mouth === "Smile" ? <path d="M 440 600 Q 500 650 560 600" fill="none" stroke={line} strokeWidth={12} strokeLinecap="round" /> : null}
        {t.mouth === "Flat" ? <line x1={455} y1={615} x2={545} y2={615} stroke={line} strokeWidth={12} strokeLinecap="round" /> : null}
        {t.mouth === "O" ? <ellipse cx={500} cy={615} rx={22} ry={26} fill={line} /> : null}
        {t.mouth === "Grin" ? (
          <g>
            <rect x={440} y={592} width={120} height={46} rx={23} fill="#FFFFFF" stroke={line} strokeWidth={8} />
            <line x1={440} y1={615} x2={560} y2={615} stroke={line} strokeWidth={5} />
          </g>
        ) : null}
        {t.mouth === "Tongue" ? (
          <g>
            <path d="M 476 616 Q 476 668 500 668 Q 524 668 524 616 Z" fill="#FF6F91" />
            <path d="M 440 604 Q 500 644 560 604" fill="none" stroke={line} strokeWidth={12} strokeLinecap="round" />
          </g>
        ) : null}

        {/* accessory (eyewear is left off a visor) */}
        {t.accessory === "Earring" ? <circle cx={t.head === "Tall" ? 330 : 308} cy={572} r={13} fill="#F2C14E" stroke="#B8862B" strokeWidth={3} /> : null}
        {t.accessory === "Glasses" && t.eyes !== "Visor" ? (
          <g fill="none" stroke="#111111" strokeWidth={9}>
            <circle cx={430} cy={480} r={52} />
            <circle cx={570} cy={480} r={52} />
            <path d="M 482 476 Q 500 462 518 476" />
          </g>
        ) : null}
        {t.accessory === "Shades" && t.eyes !== "Visor" ? (
          <g>
            <rect x={370} y={448} width={116} height={70} rx={20} fill="#111111" />
            <rect x={514} y={448} width={116} height={70} rx={20} fill="#111111" />
            <rect x={480} y={466} width={40} height={10} fill="#111111" />
            <rect x={388} y={462} width={40} height={10} rx={5} fill="#FFFFFF" opacity={0.35} />
          </g>
        ) : null}
        {t.accessory === "Monocle" && t.eyes !== "Visor" ? (
          <g fill="none" stroke="#C9962E" strokeWidth={8}>
            <circle cx={570} cy={480} r={50} />
            <path d="M 612 506 Q 640 600 610 690" strokeWidth={4} />
          </g>
        ) : null}

        {/* headwear */}
        <g transform={`translate(0 ${lift})`}>
          {t.headwear === "Cap" ? (
            <g>
              <path d="M 318 380 C 320 230 680 230 682 380 Z" fill={topColour} />
              <path d="M 470 380 L 760 380 Q 770 410 740 412 L 470 412 Z" fill={shade(topColour, -0.2)} />
              <circle cx={500} cy={262} r={12} fill={shade(topColour, -0.2)} />
            </g>
          ) : null}
          {t.headwear === "Beanie" ? (
            <g>
              <path d="M 322 372 C 322 210 678 210 678 372 Z" fill="#E63B2E" />
              <rect x={308} y={346} width={384} height={58} rx={20} fill="#B92A20" />
              <circle cx={500} cy={226} r={30} fill="#FFFFFF" />
            </g>
          ) : null}
          {t.headwear === "Crown" ? (
            <g>
              <path d="M 380 330 L 380 230 L 440 280 L 500 210 L 560 280 L 620 230 L 620 330 Z" fill="#F2C14E" stroke="#B8862B" strokeWidth={6} strokeLinejoin="round" />
              <circle cx={500} cy={292} r={13} fill="#E63B2E" />
              <circle cx={440} cy={304} r={9} fill="#1F4E9C" />
              <circle cx={560} cy={304} r={9} fill="#1F4E9C" />
            </g>
          ) : null}
          {t.headwear === "Antenna" ? (
            <g>
              <line x1={500} y1={300} x2={500} y2={185} stroke={line} strokeWidth={9} />
              <circle cx={500} cy={175} r={22} fill="#00FFC2" stroke={line} strokeWidth={6} />
            </g>
          ) : null}
        </g>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- tool */

export function TokenMaker() {
  const [seed, setSeed] = useState(4242);
  const [locked, setLocked] = useState<Partial<Traits>>({});
  const [overrides, setOverrides] = useState<Partial<Traits>>({});
  const [collection, setCollection] = useState("Playground Pals");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const traits = useMemo(() => ({ ...roll(seed, locked), ...overrides }), [seed, locked, overrides]);
  const topColour = useMemo(() => TOP_COLOURS[Math.floor(seeded(seed + 99)() * TOP_COLOURS.length)], [seed]);
  const edition = (seed % 9999) + 1;
  const name = `${collection.trim() || "Playground Pals"} #${String(edition).padStart(4, "0")}`;
  const assetName = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 32);
  const r = rarity(traits);

  const metadata = useMemo(
    () => ({
      "721": {
        "<policy_id>": {
          [assetName]: {
            name,
            image: "ipfs://<add the image's IPFS hash after uploading it>",
            mediaType: "image/png",
            description: `Made in Jethro Adebisi's Playground. ${r.tier}, about 1 in ${r.oneIn.toLocaleString()}.`,
            ...Object.fromEntries(ORDER.map((k) => [TRAITS[k].label, traits[k]])),
            Rarity: r.tier,
            Edition: edition,
          },
        },
        version: "1.0",
      },
    }),
    [assetName, name, traits, r.tier, r.oneIn, edition],
  );

  function reroll() {
    setOverrides({});
    setSeed(newSeed());
  }

  function choose(k: TraitKey, value: string) {
    setOverrides((prev) => ({ ...prev, [k]: value }));
  }

  function toggleLock(k: TraitKey) {
    setLocked((prev) => {
      const next = { ...prev };
      if (next[k]) delete next[k];
      else next[k] = traits[k];
      return next;
    });
  }

  async function savePng() {
    if (!svgRef.current) return;
    setSaving(true);
    try {
      await downloadPng(svgRef.current, 1000, 1000, `${assetName}.png`);
    } finally {
      setSaving(false);
    }
  }

  async function copyMetadata() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      downloadJson(metadata, `${assetName}.metadata.json`);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="mx-auto max-w-[620px]">
          <div className="overflow-hidden border border-border shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]">
            <Token t={traits} topColour={topColour} svgRef={svgRef} />
          </div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[18px] font-bold tracking-[-0.02em]">{name}</p>
              <p className="mt-1 text-[13px] text-text-secondary">
                <span
                  className={`mr-2 inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                    r.tier === "Legendary"
                      ? "bg-[#F2C14E] text-black"
                      : r.tier === "Epic"
                        ? "bg-[#7C5CFF] text-white"
                        : r.tier === "Rare"
                          ? "bg-accent text-black"
                          : "bg-ink/[0.07] text-text"
                  }`}
                >
                  {r.tier}
                </span>
                About 1 in {r.oneIn.toLocaleString()}
              </p>
            </div>
            <ActionButton tone="primary" onClick={reroll}>
              <Dices className="h-4 w-4" /> Roll a new one
            </ActionButton>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton onClick={savePng} disabled={saving}>
              <Download className="h-4 w-4" /> {saving ? "Saving" : "Save PNG"}
            </ActionButton>
            <ActionButton onClick={() => svgRef.current && downloadSvg(svgRef.current, `${assetName}.svg`)}>
              <Download className="h-4 w-4" /> Save SVG
            </ActionButton>
            <ActionButton onClick={() => downloadJson(metadata, `${assetName}.metadata.json`)}>
              <FileJson className="h-4 w-4" /> Save metadata
            </ActionButton>
          </div>
        </div>
      </div>

      <div>
        <Group title="Collection">
          <label className="block">
            <span className="text-[13px] font-medium">Name</span>
            <input
              value={collection}
              onChange={(e) => setCollection(e.target.value.slice(0, 40))}
              className="mt-2 w-full border border-border bg-white px-3 py-2.5 text-[14px] outline-none focus:border-ink"
            />
          </label>
        </Group>

        <Group title="Traits" aside={<span className="text-[11px] text-text-tertiary">Lock a trait to keep it when you roll</span>}>
          {ORDER.map((k) => (
            <div key={k}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-medium">{TRAITS[k].label}</span>
                <button
                  type="button"
                  onClick={() => toggleLock(k)}
                  aria-pressed={Boolean(locked[k])}
                  aria-label={`${locked[k] ? "Unlock" : "Lock"} ${TRAITS[k].label}`}
                  className={`flex h-7 w-7 items-center justify-center ${locked[k] ? "text-text" : "text-text-tertiary hover:text-text"}`}
                >
                  {locked[k] ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRAITS[k].options.map((o) => {
                  const on = traits[k] === o.name;
                  return (
                    <button
                      key={o.name}
                      type="button"
                      onClick={() => {
                        choose(k, o.name);
                        if (locked[k]) setLocked((prev) => ({ ...prev, [k]: o.name }));
                      }}
                      aria-pressed={on}
                      title={`${Math.round(chance(k, o.name) * 100)}% of tokens`}
                      className={`flex min-h-[32px] items-center gap-1.5 border px-2.5 text-[12.5px] font-medium transition-colors ${
                        on ? "border-ink bg-ink text-bg" : "border-border bg-white text-text-secondary hover:border-ink hover:text-text"
                      }`}
                    >
                      {o.colour ? <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: o.colour }} /> : null}
                      {o.name}
                      <span className={`text-[10.5px] ${on ? "text-bg/60" : "text-text-tertiary"}`}>{Math.round(chance(k, o.name) * 100)}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Group>

        <Group
          title="Cardano metadata"
          aside={
            <button type="button" onClick={copyMetadata} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary hover:text-text">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
          }
        >
          <p className="text-[12.5px] leading-[1.6] text-text-tertiary">
            In Cardano&apos;s NFT format (CIP-25). To mint it, upload the PNG to IPFS, put its hash in{" "}
            <code className="font-mono text-text">image</code> and your policy id in place of{" "}
            <code className="font-mono text-text">&lt;policy_id&gt;</code>.
          </p>
          <pre className="max-h-[260px] overflow-auto border border-border bg-white p-3 font-mono text-[11.5px] leading-[1.55] text-text-secondary">
            {JSON.stringify(metadata, null, 2)}
          </pre>
          <ActionButton disabled title="Coming later: connect a Cardano wallet and mint">
            Mint on Cardano · coming soon
          </ActionButton>
        </Group>
      </div>
    </div>
  );
}
