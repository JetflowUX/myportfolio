"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { MotionPiece } from "@/lib/data";

/* The home page's films (2026-11-04). Jethro: the moving wall of columns hid the showreel, repeated
   every film and was hard to pick from. Now the reel leads, large, playing silently once it is in
   view; six films sit still beneath it, each playing its loop on hover, with what it is written
   under the picture rather than over it. Everything opens in the lightbox with sound. */

/** a video that plays (muted) only while it is on screen, so nothing downloads off screen */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

export function ShowreelPlayer({ film, onPlay }: { film: MotionPiece; onPlay: () => void }) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    if (inView) {
      if (!v.src) v.src = film.loop;
      void v.play().catch(() => {});
    } else v.pause();
  }, [inView, film.loop, reduced]);

  return (
    <figure>
      <button
        ref={ref}
        type="button"
        onClick={onPlay}
        aria-label={`Play ${film.title} with sound`}
        className="group relative block aspect-video w-full overflow-hidden bg-ink"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={film.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {reduced ? null : <video ref={video} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />}
        {/* bottom right: the reel's own captions and name sit on the left */}
        <span className="absolute bottom-4 right-4 inline-flex min-h-[44px] items-center gap-2 bg-white px-4 text-[13px] font-semibold text-black transition-transform group-hover:-translate-y-0.5 sm:bottom-6 sm:right-6">
          <Play className="h-4 w-4 fill-current" aria-hidden /> Play with sound
        </span>
      </button>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="text-[17px] font-semibold tracking-[-0.01em]">{film.title}</span>
        <span className="text-[13px] text-text-tertiary">
          {film.meta}
          {film.blurb ? ` · ${film.blurb}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

export function FilmTile({ film, line, onOpen }: { film: MotionPiece; line: string; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const v = video.current;
    if (!v || !film.loop) return;
    if (on) {
      if (!v.src) v.src = film.loop;
      void v.play().catch(() => {});
    } else v.pause();
  }, [on, film.loop]);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      aria-label={`Watch ${film.title}`}
      className="group block text-left"
    >
      <span className="relative block aspect-video overflow-hidden bg-ink/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={film.poster}
          alt=""
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${on && film.loop ? "opacity-0" : ""}`}
        />
        {film.loop ? <video ref={video} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" /> : null}
        <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
        </span>
      </span>
      <span className="mt-3 block text-[15px] font-semibold leading-snug tracking-[-0.01em] group-hover:underline">{film.title}</span>
      <span className="mt-1 block text-[13px] leading-[1.5] text-text-secondary">{line}</span>
      <span className="mt-1 block text-[12px] text-text-tertiary">{film.meta}</span>
    </button>
  );
}
