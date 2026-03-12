import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jethro Adebisi | Front-End Engineer & UI/UX Designer',
  description: 'Portfolio for Jethro Adebisi: product-focused front-end engineering, design systems, and interactive experiences.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Noise overlay */}
        <div className="noise" />
        {/* Grid background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="grid-overlay" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00FFC2]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5D00FF]/5 blur-[120px] rounded-full" />
        </div>
        {children}
      </body>
    </html>
  );
}
