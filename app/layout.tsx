import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Noise overlay */}
        <div className="noise" />
        {/* Grid background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="grid-overlay" />
          <div className="web3-grid" />
          <div className="web3-orb web3-orb-a" />
          <div className="web3-orb web3-orb-b" />
          <div className="web3-orb web3-orb-c" />
        </div>
        {children}
      </body>
    </html>
  );
}
