"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* The contact email as a button (2026-11-03, Jethro: "make sure that the mail is clickable and
   when someone clicks on it. it shows email copied notification"). A click copies the address and
   a small notice confirms it; the clipboard API falls back to a hidden textarea where a browser
   blocks it (http, older Safari). The notice is a live region, so a screen reader hears it too. */

function copy(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise<void>((resolve, reject) => {
    const t = document.createElement("textarea");
    t.value = text;
    t.setAttribute("readonly", "");
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(t);
    if (ok) resolve();
    else reject(new Error("copy failed"));
  });
}

export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    copy(email)
      .then(() => setState("copied"))
      .catch(() => setState("failed"));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        title="Copy email address"
        className={`group inline-flex w-fit items-center gap-2 text-left text-[15px] font-semibold underline-offset-4 hover:underline ${className}`}
      >
        {email}
        {state === "copied" ? (
          <Check className="h-4 w-4 text-accent-ink" />
        ) : (
          <Copy className="h-4 w-4 text-text-tertiary transition-colors group-hover:text-text" />
        )}
      </button>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
        <AnimatePresence>
          {state !== "idle" ? (
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 bg-text px-4 py-3 text-[13px] font-semibold text-bg shadow-lg"
            >
              {state === "copied" ? (
                <>
                  <Check className="h-4 w-4 text-accent" /> Email copied: {email}
                </>
              ) : (
                <>Couldn&apos;t copy. The address is {email}</>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
