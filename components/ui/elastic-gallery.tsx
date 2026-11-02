"use client";
// ElasticGallery, from 21st.dev (pasted by Jethro, 2026-10-16). Adapted to this app:
// the items come in as a prop (his own photos, not the demo's stock), colours use the site
// tokens instead of dark: variants, the "View Project" line shows only when an item has an
// href, and Tailwind classes are Tailwind 3 compatible.

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ElasticItem {
  id: string;
  title: string;
  /** shorter label for the folded (vertical) panel */
  short?: string;
  category: string;
  src: string;
  alt: string;
  href?: string;
  /** CSS object-position, to keep a face in frame when the panel is narrow */
  position?: string;
}

function ElasticGallery({
  items,
  initialId,
  className,
}: {
  items: ElasticItem[];
  initialId?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(initialId ?? items[0]?.id ?? null);

  return (
    <div className={cn("w-full", className)}>
      {/* Fixed height on mobile and desktop so the flex animation stays stable */}
      <div className="flex h-[560px] w-full flex-col gap-2 md:h-[600px] md:flex-row md:gap-3">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)} // touch support
              className={cn(
                "relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.03]",
                "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                // active takes four parts of the row, the rest one each: the accordion
                active ? "flex-[4]" : "flex-[1]",
                active ? "brightness-100" : "brightness-50 hover:brightness-75",
              )}
            >
              {/* image */}
              <div className="absolute inset-0 h-full w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  style={{ objectPosition: item.position ?? "center" }}
                  className={cn(
                    "object-cover transition-transform duration-1000",
                    active ? "scale-100" : "scale-110",
                  )}
                />
                {/* gradient so the caption reads */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>

              <div className="absolute inset-0 flex h-full flex-col justify-end p-4 md:p-7">
                {/* active: category, title, link */}
                <div
                  className={cn(
                    "flex flex-col gap-2 transition-all duration-500",
                    active ? "translate-y-0 opacity-100 delay-200" : "translate-y-12 opacity-0",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/30 bg-white/10 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-md md:px-3 md:text-xs">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white"
                    >
                      View project <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                {/* inactive: vertical title on desktop, number on phones */}
                <div
                  className={cn(
                    "absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-500 md:bottom-7",
                    active ? "scale-50 opacity-0" : "opacity-100 delay-500",
                  )}
                >
                  <span className="hidden whitespace-nowrap text-base font-semibold tracking-wide text-white [writing-mode:vertical-rl] md:block">
                    {item.short ?? item.title}
                  </span>
                  <span className="block font-mono text-xs font-bold text-white md:hidden">{item.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ElasticGallery };
