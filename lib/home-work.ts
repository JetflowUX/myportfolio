import type { Project } from '@/lib/data';

/* The home page's "Selected work" cases, built from the admin's projects (2026-11-03). Before
   this the five cases were written into app/page.tsx, so a project added in the admin reached the
   archive and its own page but never the home page. A project shows unless showOnHome is false;
   blank home fields fall back to its title, year, description and image. */

export type HomeCase = {
  slug: string;
  title: string;
  meta: string;
  line: string;
  image: string;
  bg: string;
  dark: boolean;
};

const PAPER = '#E7E5E0';

function firstSentence(text: string): string {
  const match = text.trim().match(/^.*?[.!?](?=\s+[A-Z("']|\s*$)/);
  return (match ? match[0] : text).trim();
}

export function homeCases(projects: Project[]): HomeCase[] {
  return projects
    .filter((p) => p.showOnHome !== false)
    .map((p, index) => ({ p, index }))
    .sort((a, b) => (a.p.homeOrder ?? 1000 + a.index) - (b.p.homeOrder ?? 1000 + b.index))
    .map(({ p }) => ({
      slug: p.slug,
      title: p.homeTitle?.trim() || p.title,
      meta: p.homeMeta?.trim() || `${p.category === 'design' ? 'Product design' : 'Front-end'} · ${p.year}`,
      line: p.homeLine?.trim() || firstSentence(p.description),
      image: p.cover?.trim() || p.image,
      bg: p.coverBg?.trim() || PAPER,
      dark: Boolean(p.coverDark),
    }));
}
