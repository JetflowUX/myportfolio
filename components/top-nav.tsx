"use client";

import Link from "next/link";

/* The header, after nader.io (2026-11-02): his name in tracked capitals on the
   left, the sections in small grey capitals on the right, nothing fixed or
   blurred. It sits at the top of the page and scrolls away with it. On phones
   the links wrap to their own row under the name, so nothing hides in a menu.
   Anchors match the sections on app/page.tsx. Work opens The Shelf (/work) and Playground its
   own page (2026-11-03, his ask); Process left the menu to keep it to one row, Films
   (now on The Shelf) and About went too: the menu is Work, Playground, Contact (his call). */
const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/playground", label: "Playground" },
  { href: "/contact", label: "Contact" },
];

export function TopNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-50">
      <a
        href="#main-content"
        className="absolute left-2 top-2 -translate-y-16 bg-accent px-3 py-2 text-xs font-bold text-black focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1104px] flex-col gap-4 px-6 pt-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pt-12 lg:px-8 xl:px-0">
        <Link href="/" className="text-[12px] font-bold uppercase tracking-[0.16em] text-text">
          Jethro Adebisi
        </Link>
        <div className="-mx-2 flex flex-wrap">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary transition-colors hover:text-text sm:px-3"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
