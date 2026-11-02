"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motionWork, type MotionPiece } from "@/lib/data";
import { LightboxProvider, useLightbox } from "@/components/image-lightbox";

/**
 * MOTION & VIDEO
 *
 * Follows the #lab band pattern: a code-comment kicker, a headline, a short
 * paragraph, then a panel with the chrome header this site uses elsewhere.
 *
 * The one rule this section exists to satisfy: a portfolio of video that you
 * cannot watch is a catalogue, not a portfolio. Every tile plays a silent loop
 * in place and opens the real cut on click.
 *
 * Nothing is fetched until it is needed. Loops load when they scroll into
 * view; the watchable cut only downloads when someone actually clicks.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/* Focus-cards behaviour (Aceternity's focus-cards, from the component vault):
   hovering one film softens the rest, so the eye lands on one piece. */
function Tile({
  piece,
  index,
  hovered,
  setHovered,
}: {
  piece: MotionPiece;
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
}) {
  const { open } = useLightbox();
  const ref = useRef<HTMLVideoElement | null>(null);

  /* Play only while visible. Eight autoplaying videos is how a page like this
     ends up janky on a laptop and expensive on a phone. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = piece.loop;
          void el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin: "150px 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [piece.loop]);

  const play = () =>
    open({
      src: piece.watch,
      alt: piece.title,
      kind: "video",
      title: piece.title,
      meta: piece.meta,
    });

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE, delay: (index % 4) * 0.05 }}
      className={`group relative transition-all duration-300 ease-out ${
        hovered !== null && hovered !== index ? "scale-[0.98] opacity-50 blur-[2px]" : ""
      }`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <button
        type="button"
        onClick={play}
        aria-label={`Play ${piece.title}`}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <div className="relative aspect-video overflow-hidden rounded-xl border border-ink/10 bg-ink/[0.02]">
          <video
            ref={ref}
            poster={piece.poster}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* play affordance — the tile has to read as pressable */}
          <span
            aria-hidden
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-bg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Play className="h-3.5 w-3.5 translate-x-[1px]" strokeWidth={3} />
          </span>
        </div>

        <div className="pt-3">
          <span className="block font-mono text-[11px] text-accent-ink">
            {piece.kind}
          </span>
          <h3 className="mt-1.5 text-base font-bold leading-snug">
            {piece.title}
          </h3>
          <p className="font-sans mt-1 text-xs leading-relaxed text-text-secondary">
            {piece.blurb}
          </p>
          <span className="mt-2 block text-[10px] tracking-[0.2em] text-text-tertiary">
            {piece.meta}
          </span>
        </div>
      </button>
    </motion.article>
  );
}

function Reel() {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.src) el.src = "/motion/reel.mp4";
          void el.play().catch(() => {});
        } else if (!el.paused) el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bento-card overflow-hidden rounded-2xl">
      {/* the same chrome header the codebase panel uses */}
      <div className="flex items-center gap-2 border-b border-ink/10 bg-ink/[0.02] px-4 py-3 sm:px-5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-cold/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
        <span className="ml-2 text-[10px] font-mono tracking-widest text-text-tertiary">
          showreel · 1920×1080
        </span>
      </div>
      <video
        ref={ref}
        poster="/motion/poster/reel-poster.jpg"
        muted
        loop
        playsInline
        controls
        preload="none"
        className="aspect-video w-full bg-black"
      />
    </div>
  );
}

export default function MotionShowcase({ showReel = true }: { showReel?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <LightboxProvider>
      <section id="films" className="relative mx-auto max-w-[1200px] scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 font-mono text-xs text-accent-ink">Video &amp; motion</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              The same problems, moving.
            </h2>
          </div>
          <p className="font-sans max-w-xl text-base leading-relaxed text-text-secondary">
            60 finished films for 24 brands. These are recent spec films:
            product launches, a 3D product film and brand spots, each written,
            designed, animated and mixed by me. Every tile plays; click one to
            watch it with sound.
          </p>
        </div>

        {showReel ? (
          <div className="mb-10 sm:mb-14">
            <Reel />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {motionWork.map((piece, i) => (
            <Tile key={piece.slug} piece={piece} index={i} hovered={hovered} setHovered={setHovered} />
          ))}
        </div>
      </section>
    </LightboxProvider>
  );
}
