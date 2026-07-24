import { companies, projects, type Company, type Project } from '@/lib/data';

const DEFAULT_RESUME_URL = '/resume.pdf';

export type SiteContent = {
  projects: Project[];
  companies: Company[];
  resumeUrl: string;
  adminProjectSlugs: string[];
};

const FALLBACK_CONTENT: SiteContent = {
  projects,
  companies,
  resumeUrl: DEFAULT_RESUME_URL,
  adminProjectSlugs: [],
};

// Everything below used to read/write window.localStorage directly, which
// only ever affected the one browser it ran in — nothing an admin "saved"
// ever reached the deployed site or other visitors. It now talks to the
// /api/admin/* routes, which persist to a shared Vercel Blob store instead.

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch('/api/admin/content', { cache: 'no-store' });
    if (!res.ok) {
      return FALLBACK_CONTENT;
    }
    const data = (await res.json()) as Partial<SiteContent>;
    return {
      projects: Array.isArray(data.projects) ? data.projects : projects,
      companies: Array.isArray(data.companies) ? data.companies : companies,
      resumeUrl: typeof data.resumeUrl === 'string' && data.resumeUrl ? data.resumeUrl : DEFAULT_RESUME_URL,
      adminProjectSlugs: Array.isArray(data.adminProjectSlugs) ? data.adminProjectSlugs : [],
    };
  } catch {
    return FALLBACK_CONTENT;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  return (await getSiteContent()).projects;
}

export async function getAllCompanies(): Promise<Company[]> {
  return (await getSiteContent()).companies;
}

async function parseJsonError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function saveAdminProject(project: Project): Promise<void> {
  const res = await fetch('/api/admin/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to save project.'));
  }
}

export async function deleteAdminProject(slug: string): Promise<void> {
  const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to delete project.'));
  }
}

export async function saveAdminCompany(company: Company): Promise<void> {
  const res = await fetch('/api/admin/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(company),
  });
  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to save company.'));
  }
}

export async function deleteAdminCompany(id: string): Promise<void> {
  const res = await fetch(`/api/admin/companies?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to delete company.'));
  }
}

export async function saveAdminResume(resumeUrl: string): Promise<void> {
  const res = await fetch('/api/admin/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeUrl }),
  });
  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to save resume link.'));
  }
}

export async function deleteAdminResume(): Promise<void> {
  const res = await fetch('/api/admin/resume', { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to reset resume link.'));
  }
}

export async function uploadAdminFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseJsonError(res, 'Unable to upload file.'));
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
