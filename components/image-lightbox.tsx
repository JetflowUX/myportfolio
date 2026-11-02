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

/**
 * An item is an image unless it says otherwise. Existing callers pass
 * { src, alt } and keep working untouched; video adds three optional fields.
 */
type LightboxImage = {
  src: string;
  alt: string;
  kind?: "image" | "video" | "embed";
  title?: string;
  meta?: string;
};

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
              aria-label="Close viewer"
              className="fixed top-4 right-4 z-[101] flex min-h-[44px] items-center gap-2 border border-white/20 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md transition-colors hover:bg-white/15"
            >
              Cancel <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            {active.kind === "embed" ? (
              <motion.figure
                key={active.src}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl"
              >
                {/* a film hosted on Google Drive, in Drive's own player */}
                <iframe
                  src={active.src}
                  title={active.title ?? active.alt}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="aspect-video w-full border border-white/10 bg-black"
                />
                {(active.title || active.meta) && (
                  <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                    <span className="text-sm font-bold text-white">{active.title}</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">{active.meta}</span>
                  </figcaption>
                )}
              </motion.figure>
            ) : active.kind === "video" ? (
              <motion.figure
                key={active.src}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl"
              >
                {/* autoPlay is safe here: the viewer opened this deliberately,
                    and controls are present so it can be stopped at once. */}
                <video
                  src={active.src}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full border border-white/10 bg-black"
                />
                {(active.title || active.meta) && (
                  <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                    <span className="text-sm font-bold text-white">
                      {active.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                      {active.meta}
                    </span>
                  </figcaption>
                )}
              </motion.figure>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
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
            )}
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
