import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jethro Adebisi | Front-End Engineer & UI/UX Designer",
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

// Sets data-theme before paint so a persisted "light" choice doesn't
// flash dark on first load. Kept inline/sync — this can't wait on a
// hydrated component.
const NO_FLASH_THEME_SCRIPT = `
  try {
    var theme = window.localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.dataset.theme = theme;
    }
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body>
        {/* Noise overlay — the one texture kept site-wide; the old grid +
            3-orb stack that ran underneath it at the same time is gone. */}
        <div className="noise" />
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="web3-orb web3-orb-a" />
        </div>
        {children}
      </body>
    </html>
  );
}
