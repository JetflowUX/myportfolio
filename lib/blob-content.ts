import 'server-only';

import { get, put } from '@vercel/blob';
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
  // Companies are fully editable/deletable, defaults included — there's no
  // "Default / Read Only" distinction for them the way there still is for
  // projects. Deleting a static company (from lib/data.ts) can't remove it
  // from that array, so its id is tombstoned here and filtered out at read
  // time instead. Re-adding/editing a company with that id clears the
  // tombstone (see upsertCompany).
  deletedCompanyIds: string[];
};

const EMPTY_OVERLAY: Overlay = { projects: [], companies: [], resumeUrl: '', deletedCompanyIds: [] };

export type SiteContentPayload = {
  projects: Project[];
  companies: Company[];
  resumeUrl: string;
  adminProjectSlugs: string[];
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
    // useCache: false is required here — a plain fetch() against the blob's
    // public URL (even with Next's `cache: 'no-store'`) still hits Vercel
    // Blob's own CDN edge cache, which can serve up to ~60s-stale content
    // after a write. This route needs to read its own writes immediately
    // (e.g. right after an admin save), so it goes straight to origin.
    const result = await get(CONTENT_PATHNAME, { access: 'public', useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return EMPTY_OVERLAY;
    }
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text) as Partial<Overlay>;
    return {
      projects: Array.isArray(data.projects) ? data.projects : [],
      companies: Array.isArray(data.companies) ? data.companies : [],
      resumeUrl: typeof data.resumeUrl === 'string' ? data.resumeUrl : '',
      deletedCompanyIds: Array.isArray(data.deletedCompanyIds) ? data.deletedCompanyIds : [],
    };
  } catch {
    // Most commonly on the very first run, before any admin save has
    // ever happened, or a transient network/auth error.
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
  const deleted = new Set(overlay.deletedCompanyIds);
  const mergedCompanies = uniqueByCompanyId([...staticCompanies, ...overlay.companies]).filter(
    (item) => !deleted.has(item.id),
  );
  return {
    projects: sortProjectsByYearDesc(uniqueBySlug([...staticProjects, ...overlay.projects])),
    companies: mergedCompanies,
    resumeUrl: overlay.resumeUrl.trim() || DEFAULT_RESUME_URL,
    adminProjectSlugs: overlay.projects.map((item) => item.slug),
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
  await writeOverlay({
    ...overlay,
    companies: uniqueByCompanyId(next),
    // Saving/editing a company supersedes any earlier deletion of that id.
    deletedCompanyIds: overlay.deletedCompanyIds.filter((deletedId) => deletedId !== company.id),
  });
}

export async function removeCompany(id: string): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({
    ...overlay,
    companies: overlay.companies.filter((item) => item.id !== id),
    // Tombstone the id too, in case it's one of the static defaults from
    // lib/data.ts rather than an overlay entry — removing it from the
    // overlay array alone wouldn't stop it reappearing from the static list.
    deletedCompanyIds: overlay.deletedCompanyIds.includes(id)
      ? overlay.deletedCompanyIds
      : [...overlay.deletedCompanyIds, id],
  });
}

export async function setResumeUrl(resumeUrl: string): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({ ...overlay, resumeUrl: resumeUrl.trim() });
}

export async function clearResumeUrl(): Promise<void> {
  const overlay = await readOverlay();
  await writeOverlay({ ...overlay, resumeUrl: '' });
}
