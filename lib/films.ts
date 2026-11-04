import { driveFilms, motionWork, type MotionPiece } from '@/lib/data';

/* The films shown on the site, shared by the home page's Films section and /work (2026-11-03). */

const REEL: MotionPiece = {
  slug: 'reel',
  title: 'Showreel',
  kind: 'Motion graphics',
  blurb: '',
  meta: '0:45 · press play for sound',
  poster: '/motion/poster/reel-poster.jpg',
  loop: '/motion/reel.mp4',
  watch: '/motion/reel.mp4',
};

/* His SabiBank launch film (ads/sabibank, 2026-11-03): the same app the hero designs and builds. */
export const SABI_FILM: MotionPiece = {
  slug: 'sabi-launch',
  title: 'SabiBank · Launch film',
  kind: 'Product film',
  blurb: '',
  meta: '0:40 · launch film',
  poster: '/films/poster/sabi-launch.jpg',
  loop: '/films/loop/sabi-launch.mp4',
  watch: '/films/sabi-launch.mp4',
};

/* The 2026 showreel (films/jethro-reel Reel26, 2026-11-04): eleven of his recent films in 45 s.
   Hosted with the site, like the SabiBank film; it supersedes the October reel on Drive. */
export const SHOWREEL: MotionPiece = {
  slug: 'showreel-2026',
  title: 'Jethro Adebisi · Showreel 2026',
  kind: 'Motion graphics',
  blurb: 'Eleven recent films in 45 seconds.',
  meta: '0:45 · showreel',
  poster: '/films/poster/showreel-2026.jpg',
  loop: '/films/loop/showreel-2026.mp4',
  watch: '/films/showreel-2026.mp4',
};

/* Two recent films not on Drive (2026-10-30), hosted with the site. */
const local = (slug: string, title: string, meta: string): MotionPiece => ({
  slug,
  title,
  kind: 'Brand film',
  blurb: '',
  meta,
  poster: `/films/poster/${slug}.jpg`,
  loop: `/films/loop/${slug}.mp4`,
  watch: `/films/${slug}.mp4`,
});
const LEXI = local('lexi-pages', 'Lexi · Pages', '0:40 · launch film');
const SWERVE = local('swerve-unfolds', 'Swerve · Unfolds', '0:36 · launch film');

export function allFilms(): MotionPiece[] {
  return driveFilms.length ? [SHOWREEL, SABI_FILM, LEXI, SWERVE, ...driveFilms] : [REEL, ...motionWork];
}

/* The home page's six, chosen for range (2026-11-04): an app he designed, 3D simulation, a 3D
   product film, a film built around sound, a bright flat launch, and a long explainer. Each line is
   what the film is, in plain words. */
export const SIX: { key: string; line: string }[] = [
  { key: 'sabi-launch', line: 'Launch film for a student money app I designed.' },
  { key: 'lexi-pages', line: "A legal AI's launch, told in 3D paper." },
  { key: 'Cyberette · Show Where', line: '3D product film: showing where a video was altered.' },
  { key: 'Call4Me · On The Line', line: 'Product film for an AI that makes phone calls.' },
  { key: 'swerve-unfolds', line: 'App launch for interactive AI stories.' },
  { key: 'Black Holes · Explainer', line: 'A six-minute science explainer, built in code.' },
];

/* A featured dozen for range (his SabiBank film, the reel, product launches across fintech, AI,
   health and retail, one long explainer); change FEATURED to change it. */
export const FEATURED = [
  'sabi-launch', 'showreel-2026', 'lexi-pages', 'swerve-unfolds', 'Capveon · The Integration', 'Call4Me · On The Line',
  'Alter · Own Keys', 'Pragma · In The Open', 'KeepMe · Antares In Action', 'Vesta · In The File',
  'BillMender · Find Yours', 'Cyberette · Show Where', 'Andamio · Get Started', 'Black Holes · Explainer',
];

export const isExplainer = (p: MotionPiece) => /Explainer|Andamio · Get Started/.test(p.title);

/* How a film opens in the lightbox: Drive films in Drive's player, the rest as video. */
export const lightboxItem = (p: MotionPiece) => ({
  src: p.watch,
  alt: p.title,
  kind: (p.drive ? 'embed' : 'video') as 'embed' | 'video',
  title: p.title,
  meta: p.meta,
});
