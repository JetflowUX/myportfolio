"use client";
// Vendored from the component vault: aceternity (aceternity/sticky-scroll-reveal__sticky-scroll-reveal.tsx), 2026-10-15. Imports adapted to this app (motion/react -> framer-motion). Rewritten to follow PAGE scroll (the original scrolled inside a fixed-height box, which traps the wheel) and to the site tokens; the active-step logic is the original's.
import React, { useRef } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    kicker?: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) return index;
      return acc;
    }, 0);
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div ref={ref} className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        {content.map((item, index) => (
          <div key={item.title + index} className="flex flex-col justify-center py-10 lg:min-h-[70vh]">
            <motion.div
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              {item.kicker ? (
                <p className="font-mono text-xs text-accent-ink">{item.kicker}</p>
              ) : null}
              <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </motion.div>
            {/* phones and narrow screens: the picture sits with its step */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 lg:hidden">
              {item.content ?? null}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block">
        <div
          className={cn(
            "sticky top-[15vh] h-[70vh] overflow-hidden rounded-3xl border border-ink/10 bg-ink/[0.03]",
            contentClassName,
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {content[activeCard].content ?? null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
