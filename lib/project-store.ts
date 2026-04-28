import { companies, projects, type Company, type Project } from '@/lib/data';

const STORAGE_KEY = 'admin-projects-v1';
const COMPANY_STORAGE_KEY = 'admin-companies-v1';
const RESUME_STORAGE_KEY = 'admin-resume-v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

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

export function getAdminProjects(): Project[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => typeof item?.slug === 'string' && typeof item?.title === 'string');
  } catch {
    return [];
  }
}

export function saveAdminProjects(items: Project[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueBySlug(items)));
}

export function saveAdminProject(project: Project): void {
  const current = getAdminProjects();
  const next = [...current.filter((item) => item.slug !== project.slug), project];
  saveAdminProjects(next);
}

export function deleteAdminProject(slug: string): void {
  const current = getAdminProjects();
  saveAdminProjects(current.filter((item) => item.slug !== slug));
}

export function getAllProjects(): Project[] {
  const admin = getAdminProjects();
  return sortProjectsByYearDesc(uniqueBySlug([...projects, ...admin]));
}

export function getAdminCompanies(): Company[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(COMPANY_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Company[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item) => typeof item?.id === 'string' && typeof item?.name === 'string' && typeof item?.logo === 'string'
    );
  } catch {
    return [];
  }
}

export function saveAdminCompanies(items: Company[]): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(uniqueByCompanyId(items)));
}

export function saveAdminCompany(company: Company): void {
  const current = getAdminCompanies();
  const next = [...current.filter((item) => item.id !== company.id), company];
  saveAdminCompanies(next);
}

export function deleteAdminCompany(id: string): void {
  const current = getAdminCompanies();
  saveAdminCompanies(current.filter((item) => item.id !== id));
}

export function getAllCompanies(): Company[] {
  const admin = getAdminCompanies();
  return uniqueByCompanyId([...companies, ...admin]);
}

export function getAdminResume(): string {
  if (!isBrowser()) {
    return '';
  }

  return window.localStorage.getItem(RESUME_STORAGE_KEY) ?? '';
}

export function saveAdminResume(resumeUrl: string): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(RESUME_STORAGE_KEY, resumeUrl.trim());
}

export function deleteAdminResume(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(RESUME_STORAGE_KEY);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
