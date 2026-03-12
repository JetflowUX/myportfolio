'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { CursorFollower } from '@/components/cursor-follower';
import { ScrollProgress } from '@/components/scroll-progress';
import { TopNav } from '@/components/top-nav';
import type { Project } from '@/lib/data';
import { deleteAdminProject, getAdminProjects, saveAdminProject, slugify } from '@/lib/project-store';

type FormState = {
  title: string;
  slug: string;
  year: string;
  category: 'engineering' | 'design';
  description: string;
  problem: string;
  role: string;
  tech: string;
  image: string;
  projectLink: string;
  caseStudy: string;
};

const initialForm: FormState = {
  title: '',
  slug: '',
  year: new Date().getFullYear().toString(),
  category: 'engineering',
  description: '',
  problem: '',
  role: '',
  tech: '',
  image: '',
  projectLink: '',
  caseStudy: '',
};

export default function AdminPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState('');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    setSavedProjects(getAdminProjects());
  }, []);

  const liveSlug = useMemo(() => {
    if (form.slug.trim()) {
      return slugify(form.slug);
    }
    return slugify(form.title);
  }, [form.slug, form.title]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setStatus('Title is required.');
      return;
    }

    if (!liveSlug) {
      setStatus('Slug could not be generated.');
      return;
    }

    const project: Project = {
      slug: liveSlug,
      title: form.title.trim(),
      year: form.year.trim() || new Date().getFullYear().toString(),
      description: form.description.trim() || 'No short description provided yet.',
      problem: form.problem.trim() || 'No problem statement provided yet.',
      role: form.role.trim() || 'Role not specified',
      tech: form.tech.split(',').map((item) => item.trim()).filter(Boolean),
      category: form.category,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
      projectLink: form.projectLink.trim(),
      caseStudy: form.caseStudy.trim(),
    };

    saveAdminProject(project);
    setSavedProjects(getAdminProjects());
    const action = editingSlug ? 'Updated' : 'Saved';
    setEditingSlug(null);
    setForm(initialForm);
    setStatus(`${action} ${project.title}. Case-study page: /projects/${project.slug}`);
  }

  function onEdit(project: Project) {
    setForm({
      title: project.title,
      slug: project.slug,
      year: project.year,
      category: project.category,
      description: project.description,
      problem: project.problem,
      role: project.role,
      tech: project.tech.join(', '),
      image: project.image,
      projectLink: project.projectLink ?? '',
      caseStudy: project.caseStudy ?? '',
    });
    setEditingSlug(project.slug);
    setStatus(`Editing ${project.title}`);
  }

  function onResetForm() {
    setForm(initialForm);
    setEditingSlug(null);
    setStatus('Form cleared.');
  }

  function onDelete(slug: string) {
    deleteAdminProject(slug);
    setSavedProjects(getAdminProjects());
    setStatus(`Deleted ${slug}`);
  }

  return (
    <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      <section className="mx-auto max-w-7xl mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4">Admin Dashboard</h1>
        <p className="text-gray-400 max-w-2xl">
          Add project entries with details, project link, and case-study content. Every saved project gets a page at
          <span className="text-accent"> /projects/your-slug</span>.
        </p>
      </section>

      <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        <article className="bento-card p-5 sm:p-8 lg:col-span-7">
          <h2 className="text-2xl font-bold mb-6">{editingSlug ? 'Edit Project' : 'Create Project'}</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Project Title">
                <input value={form.title} onChange={(e) => onChange('title', e.target.value)} className="admin-input" title="Project title" placeholder="AI Travel Planner" required />
              </Field>
              <Field label="Year">
                <input value={form.year} onChange={(e) => onChange('year', e.target.value)} className="admin-input" title="Year" placeholder="2026" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Slug (optional)">
                <input value={form.slug} onChange={(e) => onChange('slug', e.target.value)} className="admin-input" placeholder="auto-generated-from-title" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={(e) => onChange('category', e.target.value as FormState['category'])} className="admin-input" title="Category">
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                </select>
              </Field>
            </div>

            <Field label="Role">
              <input value={form.role} onChange={(e) => onChange('role', e.target.value)} className="admin-input" placeholder="UX Design / Front-End" />
            </Field>

            <Field label="Project Details">
              <textarea value={form.description} onChange={(e) => onChange('description', e.target.value)} className="admin-input min-h-24" title="Project details" placeholder="Short project overview" />
            </Field>

            <Field label="Problem Statement">
              <textarea value={form.problem} onChange={(e) => onChange('problem', e.target.value)} className="admin-input min-h-24" title="Problem statement" placeholder="Core problem this project solves" />
            </Field>

            <Field label="Case Study">
              <textarea value={form.caseStudy} onChange={(e) => onChange('caseStudy', e.target.value)} className="admin-input min-h-40" placeholder="Write full case-study narrative..." />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Project Link">
                <input value={form.projectLink} onChange={(e) => onChange('projectLink', e.target.value)} className="admin-input" placeholder="https://..." />
              </Field>
              <Field label="Image URL">
                <input value={form.image} onChange={(e) => onChange('image', e.target.value)} className="admin-input" placeholder="https://..." />
              </Field>
            </div>

            <Field label="Tech Stack (comma separated)">
              <input value={form.tech} onChange={(e) => onChange('tech', e.target.value)} className="admin-input" placeholder="Next.js, TypeScript, Tailwind" />
            </Field>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button type="submit" className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs">
                {editingSlug ? 'Update Project' : 'Save Project'}
              </button>
              <button type="button" onClick={onResetForm} className="px-6 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors">
                Clear
              </button>
              <span className="text-xs text-gray-500">Generated slug: <span className="text-accent">{liveSlug || '-'}</span></span>
              {liveSlug ? <Link href={`/projects/${liveSlug}`} className="tag">Open Case Study</Link> : null}
            </div>
          </form>
          {status ? <p className="mt-4 text-xs text-accent">{status}</p> : null}
        </article>

        <aside className="bento-card p-5 sm:p-8 lg:col-span-5">
          <h2 className="text-2xl font-bold mb-2">Saved Admin Projects</h2>
          <p className="text-xs text-gray-500 mb-6">These are stored in your browser local storage for this machine.</p>
          <div className="space-y-3 max-h-[680px] overflow-auto pr-2">
            {savedProjects.length === 0 ? (
              <p className="text-sm text-gray-500">No custom projects saved yet.</p>
            ) : (
              savedProjects.map((item) => (
                <div key={item.slug} className="border border-white/10 p-4">
                  <p className="font-bold uppercase tracking-tight">{item.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1">/{item.slug}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link href={`/projects/${item.slug}`} className="tag">Case Study</Link>
                    <button onClick={() => onEdit(item)} className="tag hover:border-accent hover:text-accent">Edit</button>
                    <button onClick={() => onDelete(item.slug)} className="tag hover:border-red-400 hover:text-red-300">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Field(props: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">{props.label}</span>
      {props.children}
    </label>
  );
}
