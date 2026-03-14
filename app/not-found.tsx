import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
      <section className="mx-auto max-w-4xl bento-card p-6 sm:p-10 text-center">
        <p className="text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-500 mb-4">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-black mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you requested does not exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest"
          >
            Go Home
          </Link>
          <Link
            href="/archive"
            className="px-6 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors"
          >
            Browse Archive
          </Link>
        </div>
      </section>
    </main>
  );
}
