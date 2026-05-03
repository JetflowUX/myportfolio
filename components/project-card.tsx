"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/lib/data";

const labelMap: Record<string, string> = {
  "ai-travel-planner": "AI",
  "sabi-bank-app": "SABI",
  "refugeeaid-platform": "AID",
  "gigsgig-app": "GIG",
  "speed-math-battle": "MATH",
  "cardano-governance-platform": "DAO",
};

type Props = {
  project: Project;
  index: number;
  staggerOffset?: boolean;
};

const DEFAULT_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200";

export function ProjectCard({ project, index, staggerOffset }: Props) {
  const deepDiveHref = `/projects/${project.slug}`;
  const label =
    labelMap[project.slug] ?? project.slug.toUpperCase().slice(0, 4);
  const [imgSrc, setImgSrc] = useState(project.image || DEFAULT_PROJECT_IMAGE);

  useEffect(() => {
    setImgSrc(project.image || DEFAULT_PROJECT_IMAGE);
  }, [project.image]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: index * 0.08,
      }}
      viewport={{ once: true, amount: 0.2 }}
      className={`bento-card hyper-border group flex flex-col ${staggerOffset ? "md:mt-20" : ""}`}
    >
      {/* Scanline */}
      <div className="scanline" />

      {/* Image area */}
      <div className="h-52 sm:h-64 bg-zinc-900 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={project.title}
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_PROJECT_IMAGE)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-8xl font-black opacity-5 group-hover:scale-110 group-hover:blur-[1px] transition-all duration-700 text-white">
          {label}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            {project.title}
          </h3>
          <span className="text-[10px] border border-white/20 px-2 py-1 uppercase ml-4 shrink-0">
            {project.year}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-6 flex-1">
          {project.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <Link
            href={deepDiveHref}
            className="inline-flex items-center gap-2 text-xs font-bold text-black bg-accent px-4 py-2.5 uppercase border-0 hover:bg-white transition-all duration-300 group"
          >
            View Case Study
            <svg
              className="w-3 h-3 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          {project.projectLink ? (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-gray-400 uppercase border-b border-transparent hover:text-accent hover:border-accent transition-all"
            >
              {project.slug === "speed-math-battle"
                ? "Play Live"
                : "Open Live →"}
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
