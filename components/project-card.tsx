"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/data";

const labelMap: Record<string, string> = {
  "ai-travel-planner": "AI",
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

export function ProjectCard({ project, index, staggerOffset }: Props) {
  const deepDiveHref = `/projects/${project.slug}`;
  const label =
    labelMap[project.slug] ?? project.slug.toUpperCase().slice(0, 4);

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
          src={project.image}
          alt={project.title}
          loading="lazy"
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
        <div className="flex gap-4">
          <Link
            href={deepDiveHref}
            className="text-xs font-bold text-accent uppercase border-b border-transparent hover:border-accent hover:tracking-[0.12em] transition-all"
          >
            Case Study
          </Link>
          {project.projectLink ? (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-gray-500 uppercase hover:text-accent transition-colors"
            >
              {project.slug === "speed-math-battle" ? "Play Now" : "Live Site"}
            </a>
          ) : (
            <Link
              href="/archive"
              className="text-xs font-bold text-gray-500 uppercase hover:text-accent transition-colors"
            >
              {project.slug === "speed-math-battle" ? "Play Now" : "Live Site"}
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
