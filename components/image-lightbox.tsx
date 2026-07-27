"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LightboxImage = { src: string; alt: string };

type LightboxContextValue = {
  open: (image: LightboxImage) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

/**
 * Wrap a subtree in <LightboxProvider> so any descendant can call
 * useLightbox().open({ src, alt }) to pop the image out into a
 * full-screen viewer. The overlay itself is rendered once, here.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LightboxImage | null>(null);

  const open = useCallback((image: LightboxImage) => setActive(image), []);
  const close = useCallback(() => setActive(null), []);

  // Close on Escape and lock body scroll while the viewer is open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
          >
            {/* Cancel / close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close image viewer"
              className="fixed top-4 right-4 z-[101] flex min-h-[44px] items-center gap-2 border border-white/20 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md transition-colors hover:bg-white/15"
            >
              Cancel <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={active.src}
              src={active.src}
              alt={active.alt}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              // Stop backdrop-close when the image itself is clicked.
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[92vw] object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used within a <LightboxProvider>");
  }
  return ctx;
}
