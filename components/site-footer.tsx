"use client";

import { RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { INTRO_KEY, REPLAY_EVENT } from "@/components/overture";

/* The footer, after nader.io (2026-11-02): a hairline, a short line in tracked
   capitals, three columns with accent-ink labels, then the small print with
   the button that replays the opening (as edisonfangworkshop.com's does). */

const COLUMNS = [
  {
    title: "Work",
    links: [
      { label: "Case studies", href: "/#work" },
      { label: "The Shelf", href: "/work" },
      { label: "Playground", href: "/playground" },
      { label: "Films", href: "/work?tab=films" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Email", href: "mailto:adebisireuel@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jethro-adebisi-21872a20b" },
      { label: "Behance", href: "https://www.behance.net/adebisijethro" },
      { label: "GitHub", href: "https://github.com/adebisijethro" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/adebisijethro/" },
      { label: "X", href: "https://x.com/jethroadebisi" },
      { label: "Upwork", href: "https://www.upwork.com/freelancers/~01827558feddd7621e" },
    ],
  },
];

type SiteFooterProps = {
  /** kept for the pages that still pass it; the footer is the same everywhere */
  variant?: "full" | "compact";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SiteFooter(_props: SiteFooterProps) {
  const pathname = usePathname();

  const replay = () => {
    if (pathname === "/") {
      window.dispatchEvent(new Event(REPLAY_EVENT));
      return;
    }
    try {
      sessionStorage.removeItem(INTRO_KEY);
    } catch {}
    window.location.href = "/";
  };

  return (
    <footer className="mx-auto max-w-[1104px] px-6 pb-12 sm:px-8 lg:px-8 xl:px-0">
      <div className="grid gap-10 border-t border-text-tertiary/60 pt-10 sm:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em]">Design it. Build it. Film it.</p>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-ink">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="text-[14px] text-text-secondary transition-colors hover:text-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-[13px] text-text-secondary">
        <p>© {new Date().getFullYear()} Jethro Adebisi. Product designer, motion designer and front-end engineer.</p>
        <button type="button" onClick={replay} className="inline-flex items-center gap-2 transition-colors hover:text-text">
          Replay intro <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  );
}
