import Link from "next/link";

type SiteFooterProps = {
  variant?: "full" | "compact";
};

export function SiteFooter({ variant = "full" }: SiteFooterProps) {
  const isCompact = variant === "compact";

  return (
    <footer className="border-t border-white/10 bg-black/55 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div
          className={`grid gap-10 ${
            isCompact
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-[1.2fr_0.8fr_0.8fr]"
          }`}
        >
          <div className="space-y-4">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-accent">
              Jethro Adebisi
            </p>
            <p className="max-w-md text-sm leading-relaxed text-gray-400">
              UX Engineer crafting clean, high-performance digital products with
              strong attention to user flow, clarity, and visual precision.
            </p>
            {!isCompact ? (
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[10px] font-bold tracking-[0.16em] uppercase text-gray-200 hover:border-accent hover:text-accent transition-colors"
              >
                Start a Project
                <span aria-hidden>↗</span>
              </Link>
            ) : null}
          </div>

          {!isCompact ? (
            <div>
              <p className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">
                Navigation
              </p>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-accent transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/archive"
                    className="hover:text-accent transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#process"
                    className="hover:text-accent transition-colors"
                  >
                    Process
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="hover:text-accent transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          ) : null}

          <div>
            <p className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">
              Connect
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
              <a
                href="https://x.com/jethroadebisi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Twitter/X
              </a>
              <a
                href="https://www.linkedin.com/in/jethro-adebisi-21872a20b/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/adebisijethro"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                GitHub
              </a>
            </div>
            <a
              href="mailto:adebisireuel@gmail.com"
              className="mt-4 inline-block text-sm text-gray-400 hover:text-accent transition-colors"
            >
              adebisireuel@gmail.com
            </a>
            <p className="mt-1 text-[11px] text-gray-500">
              Response within 24 hours
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.12em] text-gray-600 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Built by Jethro Adebisi</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
