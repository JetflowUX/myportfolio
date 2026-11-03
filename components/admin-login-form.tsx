"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Field, TextInput } from "@/components/admin/ui";

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
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 py-16 text-text">
      <section className="w-full max-w-[400px]">
        <Link href="/" className="text-[13px] font-bold uppercase tracking-[0.16em]">
          Jethro Adebisi
        </Link>
        <h1 className="mt-10 text-[36px] font-black leading-none tracking-[-0.035em]">Site admin</h1>
        <p className="mt-3 text-[14px] leading-[1.6] text-text-secondary">
          Sign in to edit your projects, work history and résumé.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <Field label="Email">
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          {error ? (
            <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-[13px] text-red-800">
              {error}
            </p>
          ) : null}

          <Button tone="primary" type="submit" busy={isSubmitting} className="w-full !min-h-[46px]">
            {isSubmitting ? "Signing in" : "Sign in"}
          </Button>
        </form>

        <Link href="/" className="mt-8 inline-flex text-[13px] text-text-tertiary hover:text-text">
          Back to the site
        </Link>
      </section>
    </main>
  );
}
