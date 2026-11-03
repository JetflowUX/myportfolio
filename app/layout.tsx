import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const DESCRIPTION =
  "Jethro Adebisi designs products people trust, builds them in React and Next.js, and makes the film that explains them at launch. Case studies, front-end work and launch films.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jethrotheuxpert.vercel.app"),
  title: "Jethro Adebisi | Product Designer, Motion Designer & Front-End Engineer",
  description: DESCRIPTION,
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Jethro Adebisi",
    title: "Jethro Adebisi: design it, build it, film it",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jethro Adebisi: design it, build it, film it",
    description: DESCRIPTION,
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <noscript>
          <style>{`.overture{display:none}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        {/* page views and clicks, cookie-free; turn on Web Analytics for the project in Vercel to see them */}
        <Analytics />
      </body>
    </html>
  );
}
