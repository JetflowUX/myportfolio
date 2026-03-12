'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CursorFollower } from '@/components/cursor-follower';
import { ScrollProgress } from '@/components/scroll-progress';
import { TopNav } from '@/components/top-nav';
import { projects, type Project } from '@/lib/data';
import { getAllProjects } from '@/lib/project-store';

export default function ProjectCaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => {
    const raw = params?.slug;
    if (Array.isArray(raw)) {
      return raw[0] ?? '';
    }
    return raw ?? '';
  }, [params]);

  const [allProjects, setAllProjects] = useState<Project[]>(projects);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAllProjects(getAllProjects());
    setMounted(true);
  }, []);

  const project = allProjects.find((item) => item.slug === slug);

  if (!mounted) {
    return (
      <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
        <TopNav />
        <div className="mx-auto max-w-4xl bento-card p-6 sm:p-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">Case Study</p>
          <h1 className="text-3xl font-bold">Loading Project...</h1>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
        <TopNav />
        <div className="mx-auto max-w-4xl bento-card p-6 sm:p-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">Case Study</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">No case study exists for this slug yet. Create one from the admin dashboard.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admin" className="px-6 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest">Go to Admin</Link>
            <Link href="/archive" className="px-6 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors">Open Archive</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      <section className="mx-auto w-full max-w-6xl mb-10">
        <p className="text-xs text-accent tracking-[0.3em] uppercase mb-4">Case Study</p>
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tight uppercase">{project.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="tag">{project.year}</span>
          <span className="tag">{project.category}</span>
          <span className="tag">{project.role}</span>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-12 mb-10">
        <article className="bento-card p-5 sm:p-8 md:col-span-8">
          <h2 className="text-2xl font-bold mb-4">Project Details</h2>
          <p className="text-gray-400 leading-relaxed mb-8">{project.description}</p>

          <h3 className="text-xl font-bold mb-3">Problem</h3>
          <p className="text-gray-400 leading-relaxed mb-8">{project.problem}</p>

          <h3 className="text-xl font-bold mb-3">Case Study</h3>
          <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
            {project.caseStudy ??
              'This case study page was generated from the project dataset. Add a custom case-study narrative from the admin panel to replace this default text.'}
          </p>
        </article>

        <aside className="bento-card p-5 sm:p-8 md:col-span-4">
          <p className="text-xs text-gray-500 uppercase tracking-[0.24em] mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((item) => (
              <span key={item} className="tag">{item}</span>
            ))}
          </div>

          <p className="text-xs text-gray-500 uppercase tracking-[0.24em] mb-2">Links</p>
          <div className="space-y-3">
            <Link
              href="/archive"
              className="block text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-3 hover:border-accent transition-colors"
            >
              Back to Archive
            </Link>
            {project.projectLink ? (
              <a
                href={project.projectLink}
                target="_blank"
                rel="noreferrer"
                className="block text-xs font-bold uppercase tracking-widest bg-accent text-black px-4 py-3"
              >
                Open Project Link
              </a>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl bento-card overflow-hidden">
        <div className="relative h-72">
          <Image src={project.image} alt={project.title} fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        </div>
      </section>
    </main>
  );
}
