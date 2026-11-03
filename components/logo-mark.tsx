/* Jethro's J mark (2026-11-03): his chosen logo as one polygon, vectorised from his PNG
   (public/logo/README.md). It takes the text colour, so it works on paper and on ink. */
export function LogoMark({ className = "h-5 w-5", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 463 457" className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M73 0H463V313L339 457H92L0 365V278H158V376L375 148H73Z" />
    </svg>
  );
}
