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

export function allFilms(): MotionPiece[] {
  return driveFilms.length ? [SABI_FILM, ...driveFilms] : [REEL, ...motionWork];
}

/* A featured dozen for range (his SabiBank film, the reel, product launches across fintech, AI,
   health and retail, one long explainer); change FEATURED to change it. */
export const FEATURED = [
  'sabi-launch', 'Jethro Adebisi · Showreel 2026', 'Capveon · The Integration', 'Call4Me · On The Line',
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
