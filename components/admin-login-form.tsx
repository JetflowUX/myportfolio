"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CursorFollower } from "@/components/cursor-follower";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(payload?.error ?? "Unable to login.");
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative z-10 min-h-screen pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24 flex items-start justify-center">
      <CursorFollower />
      <section className="w-full max-w-xl bento-card p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
          Admin Login
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Sign in to manage projects, case studies, and portfolio entries.
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Username or Email
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              title="Username or Email"
              placeholder="Enter your admin email"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              title="Password"
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="text-xs text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-accent text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Signing In..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
          <a
            href="https://x.com/jethroadebisi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Twitter_X
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
      </section>
    </main>
  );
}
