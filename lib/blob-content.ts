import 'server-only';

import { del, get, list, put } from '@vercel/blob';
import {
  companies as staticCompanies,
  experience as staticExperience,
  projects as staticProjects,
  testimonials as staticTestimonials,
  type Company,
  type Experience,
  type Project,
  type Testimonial,
} from '@/lib/data';

// The admin dashboard used to write everything to the visitor's own
// localStorage, so nothing ever reached the deployed site or other
// visitors. This module replaces that with a single JSON blob in Vercel
// Blob storage — the "overlay" of admin-added/edited projects, companies,
// and resume link — merged on top of the static defaults from lib/data.ts
// at read time. Same overlay semantics as before (admin entries win by
// slug/id, deleting an overlay entry falls back to the static default if
// one exists), just persisted server-side instead of per-browser.

// SITE_CONTENT_PATHNAME points a local test run at a scratch file, so checking that saves work
// never touches the live content.
const CONTENT_PATHNAME = process.env.SITE_CONTENT_PATHNAME || 'data/site-content.json';
// Every save also writes its own numbered copy here, and the admin reads the newest one. Measured
// 2026-11-03: after overwriting CONTENT_PATHNAME, a read of it (useCache: false included) returned
// the old content for 12-41 s, so the dashboard showed a save as lost and a second save inside
// that window wrote over the first. A new file has no old copy to serve, and list() names it at once.
const VERSIONS_PREFIX = CONTENT_PATHNAME.replace(/\.json$/, '') + '-versions/';
const VERSIONS_KEPT = 10;
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
  // The home page's work history (2026-11-03), with the same tombstone rule as companies.
  experience: Experience[];
  deletedExperienceIds: string[];
  // testimonials (2026-11-03), the same rule again
  testimonials: Testimonial[];
  deletedTestimonialIds: string[];
};

const EMPTY_OVERLAY: Overlay = {
  projects: [],
  companies: [],
  resumeUrl: '',
  deletedCompanyIds: [],
  experience: [],
  deletedExperienceIds: [],
  testimonials: [],
  deletedTestimonialIds: [],
};

export type SiteContentPayload = {
  projects: Project[];
  companies: Company[];
  experience: Experience[];
  testimonials: Testimonial[];
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

function toOverlay(data: Partial<Overlay>): Overlay {
  return {
    projects: Array.isArray(data.projects) ? data.projects : [],
    companies: Array.isArray(data.companies) ? data.companies : [],
    resumeUrl: typeof data.resumeUrl === 'string' ? data.resumeUrl : '',
    deletedCompanyIds: Array.isArray(data.deletedCompanyIds) ? data.deletedCompanyIds : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    deletedExperienceIds: Array.isArray(data.deletedExperienceIds) ? data.deletedExperienceIds : [],
    testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
    deletedTestimonialIds: Array.isArray(data.deletedTestimonialIds) ? data.deletedTestimonialIds : [],
  };
}

// Version files are named by save time with a fixed number of digits, so the last one in name
// order is the newest.
async function listVersions() {
  const { blobs } = await list({ prefix: VERSIONS_PREFIX, limit: 1000 });
  return [...blobs].sort((a, b) => a.pathname.localeCompare(b.pathname));
}

// get() returns null when a file does not exist and throws when it cannot be read.
async function readFile(pathname: string): Promise<Overlay | null> {
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return toOverlay(JSON.parse(await new Response(result.stream).text()) as Partial<Overlay>);
}

async function readNewestVersion(): Promise<Overlay | null> {
  const versions = await listVersions();
  const newest = versions[versions.length - 1];
  if (!newest) return null;
  const overlay = await readFile(newest.pathname);
  if (!overlay) throw new Error('Could not read the newest saved content.');
  return overlay;
}

// The visitors' read never fails a page: anything unreadable falls back to the built-in content.
// The shared file skips Blob's CDN cache (useCache: false), as the content route always did, and
// that route's s-maxage keeps it to one read per ~10 s per region. It can lag a save by up to
// ~40 s, which is fine for visitors; the admin's refresh (fresh) reads the newest version instead.
async function readOverlay(options?: { fresh?: boolean }): Promise<Overlay> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // No Blob store linked yet (e.g. local dev before running
    // `vercel env pull`, or a fresh deploy before storage is set up).
    return EMPTY_OVERLAY;
  }
  try {
    return (options?.fresh ? await readNewestVersion() : null) ?? (await readFile(CONTENT_PATHNAME)) ?? EMPTY_OVERLAY;
  } catch {
    return EMPTY_OVERLAY;
  }
}

// Every save reads, changes one thing and writes the whole content back, so it must start from
// what is really saved. Until 2026-11-03 a failed read here counted as "nothing saved yet", and
// the save then wrote that near-empty copy over everything. Now a failed read stops the save.
async function readForWrite(): Promise<Overlay> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Storage is not configured yet. Add a Blob store to this Vercel project.');
  }
  try {
    return (await readNewestVersion()) ?? (await readFile(CONTENT_PATHNAME)) ?? EMPTY_OVERLAY;
  } catch {
    throw new Error('Could not read the saved content, so nothing was changed. Try again in a moment.');
  }
}

async function writeOverlay(overlay: Overlay): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Storage is not configured yet. Add a Blob store to this Vercel project.');
  }

  const body = JSON.stringify(overlay);
  await put(`${VERSIONS_PREFIX}${Date.now().toString().padStart(15, '0')}.json`, body, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });

  // The shared file is what visitors read (cached for up to a minute), so it is kept in step too.
  await put(CONTENT_PATHNAME, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    // Admin edits should show up quickly; keep the CDN cache window short
    // rather than the 1-month default (also the platform minimum).
    cacheControlMaxAge: 60,
    contentType: 'application/json',
  });

  const versions = await listVersions();
  const stale = versions.slice(0, Math.max(0, versions.length - VERSIONS_KEPT));
  if (stale.length) await del(stale.map((item) => item.url));
}

export async function getSiteContentPayload(options?: { fresh?: boolean }): Promise<SiteContentPayload> {
  const overlay = await readOverlay(options);
  const deleted = new Set(overlay.deletedCompanyIds);
  const mergedCompanies = uniqueByCompanyId([...staticCompanies, ...overlay.companies]).filter(
    (item) => !deleted.has(item.id),
  );
  // A saved project is laid over its static default field by field, so the home-page fields the
  // defaults carry (cover, colour, summary) survive an edit made before those fields existed.
  const staticBySlug = new Map(staticProjects.map((item) => [item.slug, item]));
  const overlaid = overlay.projects.map((item) => ({ ...staticBySlug.get(item.slug), ...item }));
  const deletedExperience = new Set(overlay.deletedExperienceIds);
  const mergedExperience = Array.from(
    new Map([...staticExperience, ...overlay.experience].map((item) => [item.id, item])).values(),
  )
    .filter((item) => !deletedExperience.has(item.id))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const deletedTestimonials = new Set(overlay.deletedTestimonialIds);
  const mergedTestimonials = Array.from(
    new Map([...staticTestimonials, ...overlay.testimonials].map((item) => [item.id, item])).values(),
  )
    .filter((item) => !deletedTestimonials.has(item.id))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return {
    projects: sortProjectsByYearDesc(uniqueBySlug([...staticProjects, ...overlaid])),
    companies: mergedCompanies,
    experience: mergedExperience,
    testimonials: mergedTestimonials,
    resumeUrl: overlay.resumeUrl.trim() || DEFAULT_RESUME_URL,
    adminProjectSlugs: overlay.projects.map((item) => item.slug),
  };
}

export async function upsertProject(project: Project): Promise<void> {
  const overlay = await readForWrite();
  const next = [...overlay.projects.filter((item) => item.slug !== project.slug), project];
  await writeOverlay({ ...overlay, projects: uniqueBySlug(next) });
}

export async function removeProject(slug: string): Promise<void> {
  const overlay = await readForWrite();
  await writeOverlay({ ...overlay, projects: overlay.projects.filter((item) => item.slug !== slug) });
}

export async function upsertCompany(company: Company): Promise<void> {
  const overlay = await readForWrite();
  const next = [...overlay.companies.filter((item) => item.id !== company.id), company];
  await writeOverlay({
    ...overlay,
    companies: uniqueByCompanyId(next),
    // Saving/editing a company supersedes any earlier deletion of that id.
    deletedCompanyIds: overlay.deletedCompanyIds.filter((deletedId) => deletedId !== company.id),
  });
}

export async function removeCompany(id: string): Promise<void> {
  const overlay = await readForWrite();
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
  const overlay = await readForWrite();
  await writeOverlay({ ...overlay, resumeUrl: resumeUrl.trim() });
}

export async function clearResumeUrl(): Promise<void> {
  const overlay = await readForWrite();
  await writeOverlay({ ...overlay, resumeUrl: '' });
}

export async function upsertExperience(entry: Experience): Promise<void> {
  const overlay = await readForWrite();
  await writeOverlay({
    ...overlay,
    experience: [...overlay.experience.filter((item) => item.id !== entry.id), entry],
    deletedExperienceIds: overlay.deletedExperienceIds.filter((id) => id !== entry.id),
  });
}

export async function removeExperience(id: string): Promise<void> {
  const overlay = await readForWrite();
  await writeOverlay({
    ...overlay,
    experience: overlay.experience.filter((item) => item.id !== id),
    deletedExperienceIds: overlay.deletedExperienceIds.includes(id)
      ? overlay.deletedExperienceIds
      : [...overlay.deletedExperienceIds, id],
  });
}

export async function upsertTestimonial(entry: Testimonial): Promise<void> {
  const overlay = await readForWrite();
  await writeOverlay({
    ...overlay,
    testimonials: [...overlay.testimonials.filter((item) => item.id !== entry.id), entry],
    deletedTestimonialIds: overlay.deletedTestimonialIds.filter((id) => id !== entry.id),
  });
}

export async function removeTestimonial(id: string): Promise<void> {
  const overlay = await readForWrite();
  await writeOverlay({
    ...overlay,
    testimonials: overlay.testimonials.filter((item) => item.id !== id),
    deletedTestimonialIds: overlay.deletedTestimonialIds.includes(id)
      ? overlay.deletedTestimonialIds
      : [...overlay.deletedTestimonialIds, id],
  });
}
