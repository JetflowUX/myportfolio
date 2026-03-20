import { companies, projects, type Company, type Project } from '@/lib/data';

const STORAGE_KEY = 'admin-projects-v1';
const COMPANY_STORAGE_KEY = 'admin-companies-v1';
const REFUGEEAID_BROKEN_IMAGE =
  'https://pixabay.com/get/g2f6c268a5562e103bd63909765133cde08ce0234e8a9c112eb6310c0771be1c4947b6b7e196f8bfd42b354c3565dd665_1920.jpg';
const REFUGEEAID_IMAGE =
  'https://cdn.pixabay.com/photo/2015/09/07/21/00/war-929109_1920__0956a8396d.jpg';

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

function normalizeProjectImage(item: Project): Project {
  if (item.slug !== 'refugeeaid-platform') {
    return item;
  }

  const nextImage =
    item.image === REFUGEEAID_BROKEN_IMAGE ||
    item.image.includes('pixabay.com/get/')
      ? REFUGEEAID_IMAGE
      : item.image;
  const nextCaseStudyImage =
    item.caseStudyImage === REFUGEEAID_BROKEN_IMAGE ||
    item.caseStudyImage?.includes('pixabay.com/get/')
      ? REFUGEEAID_IMAGE
      : item.caseStudyImage;

  if (nextImage === item.image && nextCaseStudyImage === item.caseStudyImage) {
    return item;
  }

  return {
    ...item,
    image: nextImage,
    caseStudyImage: nextCaseStudyImage,
  };
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
  return uniqueBySlug([...projects, ...admin]).map(normalizeProjectImage);
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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
