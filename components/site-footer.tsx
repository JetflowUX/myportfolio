import Link from "next/link";

type SiteFooterProps = {
  variant?: "full" | "compact";
};

export function SiteFooter({ variant = "full" }: SiteFooterProps) {
  const isCompact = variant === "compact";

  return (
    <footer className="border-t border-ink/10 bg-bg/55 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div
          className={`grid gap-10 ${
            isCompact
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-[1.2fr_0.8fr_0.8fr]"
          }`}
        >
          <div className="space-y-4">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-accent-ink">
              Jethro Adebisi
            </p>
            <p className="font-sans max-w-md text-sm leading-relaxed text-text-secondary">
              UX Engineer crafting clean, high-performance digital products with
              strong attention to user flow, clarity, and visual precision.
            </p>
            {!isCompact ? (
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-[10px] font-bold tracking-[0.16em] uppercase text-text-secondary hover:border-accent-ink hover:text-accent-ink transition-colors"
              >
                Start a Project
                <span aria-hidden>↗</span>
              </Link>
            ) : null}
          </div>

          {!isCompact ? (
            <div>
              <p className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary">
                Navigation
              </p>
              <ul className="font-sans space-y-2.5 text-sm text-text-secondary">
                <li>
                  <Link
                    href="/"
                    className="hover:text-accent-ink transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/archive"
                    className="hover:text-accent-ink transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#process"
                    className="hover:text-accent-ink transition-colors"
                  >
                    Process
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="hover:text-accent-ink transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}

          <div>
            <p className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary">
              Connect
            </p>
            <div className="font-sans flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
              <a
                href="https://x.com/jethroadebisi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-ink transition-colors"
              >
                Twitter/X
              </a>
              <a
                href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-ink transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/adebisijethro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-ink transition-colors"
              >
                GitHub
              </a>
            </div>
            <a
              href="mailto:adebisireuel@gmail.com"
              className="font-sans mt-4 inline-block text-sm text-text-secondary hover:text-accent-ink transition-colors"
            >
              adebisireuel@gmail.com
            </a>
            <p className="mt-1 text-[11px] text-text-tertiary">
              Response within 24 hours
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-ink/10 pt-4 text-[10px] uppercase tracking-[0.12em] text-text-tertiary flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Built by Jethro Adebisi</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
