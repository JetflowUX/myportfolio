"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 w-full z-50 pointer-events-auto py-3 sm:py-4 transition-all duration-300 ${
        scrolled
          ? "bg-bg/75 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent"
      }`}
    >
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="absolute top-2 left-2 bg-accent text-black px-3 py-2 text-xs font-bold opacity-0 focus:opacity-100 -translate-y-10 focus:translate-y-0 transition-all"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 group"
          onClick={closeMenu}
        >
          <div className="w-10 h-10 border border-accent flex items-center justify-center relative overflow-hidden shadow-[0_0_16px_rgba(0,255,194,0.18)] transition-shadow duration-500">
            <span className="font-mono text-accent-ink font-bold text-xl relative z-10 group-hover:scale-125 transition-transform duration-500">
              Σ
            </span>
            <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </div>
          <span className="hidden min-[420px]:inline font-mono text-xs sm:text-sm font-bold tracking-tight">
            Jethro the UXpert
          </span>
        </Link>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            title="Toggle navigation menu"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] p-2 hover:opacity-70 transition-opacity"
          >
            <span
              className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
          <Link
            href="/#work"
            className="px-2 lg:px-3 py-2 hover:text-accent-ink transition-colors"
            onClick={closeMenu}
          >
            Work
          </Link>
          <Link
            href="/#process"
            className="px-2 lg:px-3 py-2 hover:text-accent-ink transition-colors"
            onClick={closeMenu}
          >
            Process
          </Link>
          <Link
            href="/#lab"
            className="px-2 lg:px-3 py-2 hover:text-accent-ink transition-colors"
            onClick={closeMenu}
          >
            Lab
          </Link>
          <Link
            href="/#contact"
            className="ml-1 px-4 py-2.5 lg:px-6 lg:py-3 bg-ink text-bg hover:bg-accent hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest"
            onClick={closeMenu}
          >
            Let&apos;s Talk
          </Link>
          <ThemeToggle className="ml-1" />
        </div>
      </div>

      {menuOpen ? (
        <div className="md:hidden mx-4 mt-3 max-w-7xl border border-ink/10 bg-bg/95 backdrop-blur-md p-4">
          <div className="flex flex-col gap-3 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Link
              href="/#work"
              className="px-3 py-3 hover:text-accent-ink transition-colors block"
              onClick={closeMenu}
            >
              Work
            </Link>
            <Link
              href="/#process"
              className="px-3 py-3 hover:text-accent-ink transition-colors block"
              onClick={closeMenu}
            >
              Process
            </Link>
            <Link
              href="/#lab"
              className="px-3 py-3 hover:text-accent-ink transition-colors block"
              onClick={closeMenu}
            >
              Lab
            </Link>
            <Link
              href="/#contact"
              className="mt-1 px-4 py-3 bg-ink text-bg hover:bg-accent hover:text-black transition-colors text-center block"
              onClick={closeMenu}
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      ) : null}
    </motion.nav>
  );
}
