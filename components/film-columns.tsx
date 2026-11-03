"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mouse } from "lucide-react";
import type { MotionPiece } from "@/lib/data";

/* ---------------------------------------------------------------------------
   FILM COLUMNS (2026-11-02)

   Jethro, pointing at nomadlabs.es: "the video section should have this
   infinite scroll kind of thing, but outside the video section you should
   still be able to scroll down."

   So, as on that site: the films stand in columns that never end, each
   column repeating its films, neighbours travelling in opposite directions
   at slightly different speeds, eased toward where the wheel sent them.

   What differs, on purpose:
   - Only this section takes the wheel, and only while the pointer is over
     it. It is shorter than the screen (82vh at most), so there is always
     page above or below it to scroll from.
   - Touch is never captured, so a phone can never get stuck inside it. The
     page scrolls as usual, and the columns move with the page.
   - The columns drift slowly on their own while the section is on screen.
     They pause under the pointer and hold still under reduced motion.

   Repeats are aria-hidden and out of the tab order, so only the first copy
   of each film can be focused. A film's loop loads only on hover; a click
   opens it with sound.
   --------------------------------------------------------------------------- */

const COPIES = 4;
const SPEEDS = [1, 0.82, 1.12];
const PHASE = [0, 140, 60];

function Card({ piece, ghost, onOpen }: { piece: MotionPiece; ghost: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!piece.loop) return; // a Drive film: no loop, the poster stays
    if (on) {
      if (!v.src) v.src = piece.loop;
      void v.play().catch(() => {});
    } else v.pause();
  }, [on, piece.loop]);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      tabIndex={ghost ? -1 : 0}
      aria-hidden={ghost || undefined}
      aria-label={ghost ? undefined : `Watch ${piece.title}`}
      className="group relative block aspect-video w-full overflow-hidden bg-black text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={piece.poster} alt="" loading="lazy" className={`absolute inset-0 z-[1] h-full w-full object-cover transition-[opacity,transform] duration-500 ${piece.loop ? "group-hover:opacity-0" : "group-hover:scale-[1.04]"}`} />
      <video ref={ref} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute right-2.5 top-2.5 z-[2] hidden h-7 w-7 sm:grid place-items-center bg-bg/90 text-text transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
      <span className="absolute bottom-1.5 left-1.5 z-[2] max-w-[calc(100%-12px)] truncate bg-bg/90 px-1.5 py-0.5 text-[10px] font-semibold text-text sm:bottom-2.5 sm:left-2.5 sm:px-2 sm:py-1 sm:text-[11px]">
        {piece.title}
        <span className="ml-2 hidden font-normal text-text-tertiary sm:inline">{piece.meta}</span>
      </span>
    </button>
  );
}

export function FilmColumns({ pieces, onOpen }: { pieces: MotionPiece[]; onOpen: (p: MotionPiece) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const [cols3, setCount] = useState(3);
  // never more columns than films (two explainers make two columns, not a third that is empty)
  const count = Math.max(1, Math.min(cols3, pieces.length));

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const set = () => setCount(mq.matches ? 2 : 3);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // films dealt into columns, round robin
  const lanes = Array.from({ length: count }, (_, c) => pieces.filter((_, i) => i % count === c));
  // a long column already outruns the window, so two copies are enough to never end
  const copies = Math.min(...lanes.map((l) => l.length)) >= 6 ? 2 : COPIES;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = 0;
    let current = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let hovering = false;
    let lastScroll = window.scrollY;
    let heights: number[] = [];

    const measure = () => {
      heights = cols.current.slice(0, count).map((c) => (c?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0);
    };

    const place = () => {
      cols.current.slice(0, count).forEach((c, i) => {
        const h = heights[i];
        if (!c || !h) return;
        const off = (((current * SPEEDS[i % 3] + PHASE[i % 3]) % h) + h) % h;
        // even columns travel up, odd ones down
        const y = i % 2 === 0 ? -off : off - h;
        c.style.transform = `translate3d(0,${Math.round(y)}px,0)`;
      });
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      if (!reduce && !hovering) target += dt * 0.022;
      current += (target - current) * 0.08;
      place();
      if (visible && (!reduce || Math.abs(target - current) > 0.5)) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch zoom stays the browser's
      e.preventDefault();
      target += e.deltaY + e.deltaX;
      start();
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (visible) {
        target += (y - lastScroll) * 0.5;
        start();
      }
      lastScroll = y;
    };
    const enter = () => (hovering = true);
    const leave = () => {
      hovering = false;
      start();
    };

    measure();
    place();
    const ro = new ResizeObserver(() => {
      measure();
      place();
    });
    cols.current.slice(0, count).forEach((c) => c?.firstElementChild && ro.observe(c.firstElementChild));
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  return (
    <div className="relative">
    <div
      ref={box}
      className="relative h-[70vh] max-h-[780px] min-h-[420px] overflow-hidden border border-border sm:h-[82vh]"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)",
      }}
    >
      <div className="grid h-full gap-2 p-2 sm:gap-3 sm:p-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {lanes.map((lane, c) => (
          <div key={`${count}-${c}`} ref={(n) => { cols.current[c] = n; }} className="will-change-transform">
            {Array.from({ length: copies }, (_, k) => (
              <div key={k} className="flex flex-col gap-2 pb-2 sm:gap-3 sm:pb-3">
                {lane.map((p) => (
                  <Card key={p.slug} piece={p} ghost={k > 0} onOpen={() => onOpen(p)} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

      {/* the hint, for a mouse only: touch never gets captured. Outside the
          mask, which would fade it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center [@media(hover:hover)]:flex">
        <span className="flex items-center gap-2 bg-text px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-bg">
          <Mouse className="h-3.5 w-3.5" /> Scroll to browse · {pieces.length} films
        </span>
      </div>
    </div>
  );
}
