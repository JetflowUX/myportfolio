"use client";

import { useEffect, useRef, useState } from "react";

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isNavHover, setIsNavHover] = useState(false);

  useEffect(() => {
    // Real cursor position — updated instantly on every mousemove
    const mouse = { x: -100, y: -100 };
    // Ring lerp position — smoothly trails the cursor
    const ring = { x: -100, y: -100 };
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element &&
      Boolean(t.closest('nav a, nav button, nav [role="button"]'));

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) setIsNavHover(true);
    };
    const onOut = (e: MouseEvent) => {
      if (!isInteractive(e.relatedTarget)) setIsNavHover(false);
    };

    const tick = () => {
      // DOT: zero-lag — top-left placed so centre aligns with hotspot
      // dot is 8×8px  → subtract 4px each axis
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`;
      }

      // RING: lerp toward real cursor for a smooth trailing feel
      // ring is 40×40px → subtract 20px each axis
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x - 20}px, ${ring.y - 20}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Dot — instant, always exactly on the real click hotspot */}
      <div
        ref={dotRef}
        className="cursor-follower pointer-events-none fixed top-0 left-0 z-[10001] w-2 h-2 rounded-full bg-accent"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      />
      {/* Ring — smooth trailing ring, purely decorative */}
      <div
        ref={ringRef}
        className={`cursor-follower pointer-events-none fixed top-0 left-0 z-[10000] w-10 h-10 rounded-full border transition-[border-color,background-color] duration-150 ${
          isNavHover
            ? "border-accent/60 bg-accent/10 scale-125"
            : "border-accent/40"
        }`}
        style={{ willChange: "transform" }}
        aria-hidden="true"
      />
    </>
  );
}
