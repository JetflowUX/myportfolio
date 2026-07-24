import 'server-only';

import { head, put } from '@vercel/blob';
import { companies as staticCompanies, projects as staticProjects, type Company, type Project } from '@/lib/data';

// The admin dashboard used to write everything to the visitor's own
// localStorage, so nothing ever reached the deployed site or other
// visitors. This module replaces that with a single JSON blob in Vercel
// Blob storage — the "overlay" of admin-added/edited projects, companies,
// and resume link — merged on top of the static defaults from lib/data.ts
// at read time. Same overlay semantics as before (admin entries win by
// slug/id, deleting an overlay entry falls back to the static default if
// one exists), just persisted server-side instead of per-browser.

const CONTENT_PATHNAME = 'data/site-content.json';
const DEFAULT_RESUME_URL = '/resume.pdf';

type Overlay = {
  projects: Project[];
  companies: Company[];
  resumeUrl: string;
};

const EMPTY_OVERLAY: Overlay = { projects: [], companies: [], resumeUrl: '' };

export type SiteContentPayload = {
  projects: Project[];
  companies: Company[];
  resumeUrl: string;
  adminProjectSlugs: string[];
  adminCompanyIds: string[];
};

function uniqueBySlug(items: Project[]): Project[] {
  const map = new Map<string, Project>();
  for (const item of items) {
    map.set(item.slug, item);
  }
  return Array.from(map.values());
}

function uniqueByCompanyId(items: Company[]): Company[] {
  const map = new Map<string, Company>();
  for (const item of items) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

function sortProjectsByYearDesc(items: Project[]): Project[] {
  return [...items].sort((a, b) => {
    const yearA = Number.parseInt(a.year, 10);
    const yearB = Number.parseInt(b.year, 10);

    if (Number.isNaN(yearA) && Number.isNaN(yearB)) return 0;
    if (Number.isNaN(yearA)) return 1;
    if (Number.isNaN(yearB)) return -1;

    if (yearA !== yearB) return yearB - yearA;
    return a.title.localeCompare(b.title);
  });
}

async function readOverlay(): Promise<Overlay> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // No Blob store linked yet (e.g. local dev before running
    // `vercel env pull`, or a fresh deploy before storage is set up).
    // Fail open to "no admin data" rather than breaking every page.
    return EMPTY_OVERLAY;
  }

  try {
    const meta = await head(CONTENT_PATHNAME);
    const res = await fetch(meta.url, { cache: 'no-store' });
    if (!res.ok) {
      return EMPTY_OVERLAY;
    }
    const data = (await res.json()) as Partial<Overlay>;
    return {
      projects: Array.isArray(data.projects) ? data.projects : [],
      companies: Array.isArray(data.companies) ? data.companies : [],
      resumeUrl: typeof data.resumeUrl === 'string' ? data.resumeUrl : '',
    };
  } catch {
    // Most commonly BlobNotFoundError on the very first run, before any
    // admin save has ever happened.
    return EMPTY_OVERLAY;
  }
}

async function writeOverlay(overlay: Overlay): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Storage is not configured yet. Add a Blob store to this Vercel project.');
  }

  await put(CONTENT_PATHNAME, JSON.stringify(overlay), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    // Admin edits should show up quickly; keep the CDN cache window short
    // rather than the 1-month default (also the platform minimum).
    cacheControlMaxAge: 60,
    contentType: 'application/json',
  });
}

export async function getSiteContentPayload(): Promise<SiteContentPayload> {
  const overlay = await readOverlay();
  return {
    projects: sortProjectsByYearDesc(uniqueBySlug([...staticProjects, ...overlay.projects])),
    companies: uniqueByCompanyId([...staticCompanies, ...overlay.companies]),
    resumeUrl: overlay.resumeUrl.trim() || DEFAULT_RESUME_URL,
    adminProjectSlugs: overlay.projects.map((item) => item.slug),
    adminCompanyIds: overlay.companies.map((item) => item.id),
  };
}

export async function upsertProject(project: Project): Promise<void> {
  const overlay = await readOverlay();
  const next = [...overlay.projects.filter((item) => item.slug !== project.slug), project];
  await writeOverlay({ ...overlay, projects: uniqueBySlug(next) });
}

export async function removeProject(slug: string): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({ ...overlay, projects: overlay.projects.filter((item) => item.slug !== slug) });
}

export async function upsertCompany(company: Company): Promise<void> {
  const overlay = await readOverlay();
  const next = [...overlay.companies.filter((item) => item.id !== company.id), company];
  await writeOverlay({ ...overlay, companies: uniqueByCompanyId(next) });
}

export async function removeCompany(id: string): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({ ...overlay, companies: overlay.companies.filter((item) => item.id !== id) });
}

export async function setResumeUrl(resumeUrl: string): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({ ...overlay, resumeUrl: resumeUrl.trim() });
}

export async function clearResumeUrl(): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({ ...overlay, resumeUrl: '' });
}
