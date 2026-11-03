"use client";

import { useEffect, useState } from "react";
import { ShapeStudy } from "@/components/playground/shape-study";
import { TokenMaker } from "@/components/playground/token-maker";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";

/* The Playground (2026-11-03). Jethro: "a mathematics kind of thing where you can tweak numbers
   and you give an image ... the second one would be like an NFT maker". Two small tools that make
   something a visitor can keep. Everything runs in the browser; nothing is sent anywhere.
   ?tool=token opens the second one. */

const TOOLS = [
  { id: "shapes", name: "Shape study", line: "Squares, rectangles and circles on a grid, set by one formula." },
  { id: "token", name: "Token maker", line: "A collectible character with traits, rarity and Cardano-ready metadata." },
] as const;
type ToolId = (typeof TOOLS)[number]["id"];

export default function PlaygroundPage() {
  const [tool, setTool] = useState<ToolId>("shapes");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tool") === "token") setTool("token");
  }, []);

  function choose(next: ToolId) {
    setTool(next);
    window.history.replaceState(null, "", next === "shapes" ? "/playground" : `/playground?tool=${next}`);
  }

  return (
    <>
      <ScrollProgress />
      <TopNav />
      <main id="main-content" className="mx-auto max-w-[1180px] px-6 pb-28 pt-36 sm:px-8 sm:pt-40 lg:px-8">
        <header className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="label">Playground</p>
            <h1 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.045em] sm:text-[64px]">
              Make something, then keep it.
            </h1>
          </div>
          <p className="max-w-[440px] text-[15px] leading-[1.6] text-text-secondary lg:justify-self-end">
            Small tools I built for the fun of it. Change the numbers, roll the dice, and save what you make. It all
            runs in your browser.
          </p>
        </header>

        <div className="cells mt-12 grid sm:grid-cols-2" role="tablist" aria-label="Playground tools">
          {TOOLS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tool === t.id}
              onClick={() => choose(t.id)}
              className={`relative p-5 text-left transition-colors sm:p-6 ${tool === t.id ? "bg-white" : "hover:bg-white/60"}`}
            >
              {tool === t.id ? <span className="absolute inset-x-0 top-0 h-[3px] bg-accent" /> : null}
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">0{i + 1}</span>
              <span className="mt-2 block text-[20px] font-bold tracking-[-0.02em]">{t.name}</span>
              <span className="mt-1 block text-[13.5px] leading-[1.55] text-text-secondary">{t.line}</span>
            </button>
          ))}
        </div>

        <div className="mt-12">{tool === "shapes" ? <ShapeStudy /> : <TokenMaker />}</div>
      </main>
      <SiteFooter variant="compact" />
    </>
  );
}
