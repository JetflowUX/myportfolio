'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/lib/data';

// Accent colors per project for the gradient overlays
const gradientMap: Record<string, string> = {
  'ai-travel-planner': 'from-[#00FFC2]/20 to-transparent',
  'refugeeaid-platform': 'from-blue-500/10 to-transparent',
  'gigsgig-app': 'from-red-500/10 to-transparent',
  'speed-math-battle': 'from-purple-500/10 to-transparent',
  'cardano-governance-platform': 'from-blue-400/10 to-transparent',
};

const labelMap: Record<string, string> = {
  'ai-travel-planner': 'AI',
  'refugeeaid-platform': 'AID',
  'gigsgig-app': 'GIG',
  'speed-math-battle': 'MATH',
  'cardano-governance-platform': 'DAO',
};

type Props = {
  project: Project;
  index: number;
  staggerOffset?: boolean;
};

export function ProjectCard({ project, index, staggerOffset }: Props) {
  const deepDiveHref = `/projects/${project.slug}`;
  const gradient = gradientMap[project.slug] ?? 'from-white/5 to-transparent';
  const label = labelMap[project.slug] ?? project.slug.toUpperCase().slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, amount: 0.2 }}
      className={`bento-card hyper-border group flex flex-col ${staggerOffset ? 'md:mt-20' : ''}`}
    >
      {/* Scanline */}
      <div className="scanline" />

      {/* Image area - dark zinc bg with text watermark like the reference */}
      <div className="h-52 sm:h-64 bg-zinc-900 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-8xl font-black opacity-5 group-hover:scale-110 transition-transform duration-700 text-white">
          {label}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{project.title}</h3>
          <span className="text-[10px] border border-white/20 px-2 py-1 uppercase ml-4 shrink-0">{project.year}</span>
        </div>
        <p className="text-gray-400 text-sm mb-6 flex-1">{project.description}</p>
        <div className="flex gap-4">
          <Link href={deepDiveHref} className="text-xs font-bold text-accent uppercase border-b border-transparent hover:border-accent transition-all">
            Case Study
          </Link>
          {project.projectLink ? (
            <a
              href={project.projectLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-gray-500 uppercase hover:text-accent transition-colors"
            >
              {project.slug === 'speed-math-battle' ? 'Play Now' : 'Live Site'}
            </a>
          ) : (
            <Link href="/archive" className="text-xs font-bold text-gray-500 uppercase hover:text-accent transition-colors">
              {project.slug === 'speed-math-battle' ? 'Play Now' : 'Live Site'}
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
