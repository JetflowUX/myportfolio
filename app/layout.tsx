import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jethro Adebisi | Product Designer, Motion Designer & Front-End Engineer",
  description:
    "Portfolio for Jethro Adebisi: product-focused front-end engineering, design systems, and interactive experiences.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

// Explicit mobile scaling. maximumScale is intentionally left unset so users
// can still pinch-zoom (accessibility).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Runs before paint. Light is the only theme (2026-11-02), and the opening
// plays once per session on the home page, never under reduced motion. The
// overture is in the first paint, so the page never flashes before it.
const BOOT_SCRIPT = `
  try {
    var d = document.documentElement;
    var seen = window.sessionStorage.getItem('ja-intro-seen');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    d.dataset.intro = (seen || reduce || location.pathname !== '/') ? 'skip' : 'play';
  } catch (e) {
    document.documentElement.dataset.intro = 'skip';
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <noscript>
          <style>{`.overture{display:none}`}</style>
        </noscript>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
