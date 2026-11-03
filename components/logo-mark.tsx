/* Jethro's J mark (2026-11-03): his chosen logo (the arrow J, swapped in the same day), vectorised from his PNG
   (public/logo/README.md). It takes the text colour, so it works on paper and on ink. */
export function LogoMark({ className = "h-5 w-5", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 441 505" className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M 441 0 L 240 1 L 225 44 L 351.5 45 L 261 335 C 249.1 373.1 210.7 411.3 168 407 C 110.2 401.2 68.3 343.8 96.2 288 C 107.4 265.6 121.3 247.8 140 231 C 156.1 216.5 180.6 195.4 202 190 L 227 223 L 256 118 L 144 118 L 173 152 C 120 184.8 66.1 206.4 28.6 260 C -26.2 338.3 2.9 446.2 88 488.8 C 152.8 521.2 232.4 505.6 283 455 C 301.4 436.6 316.5 408.8 324 384 Z" />
    </svg>
  );
}
