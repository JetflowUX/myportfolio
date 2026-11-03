"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

/* The contact form (2026-11-03), shared by the home page's contact section and /contact. It posts
   to /api/send-contact, which emails him through Resend. On /contact it also asks what the message
   is about; the choice goes at the top of the email so he can see it before reading on. A
   `topic` from outside (the "Ask about this" buttons) selects one. */

export const TOPICS = ["Product design", "A front-end build", "A launch film", "A role on your team", "Something else"] as const;
export type Topic = (typeof TOPICS)[number];

const field =
  "w-full border border-border bg-white/70 px-4 py-3.5 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-text-tertiary focus:border-ink focus:shadow-[0_0_0_3px_rgb(var(--accent-rgb)/0.35)]";

export function ContactForm({
  withTopics = false,
  withLabels = false,
  topic,
  onTopic,
}: {
  withTopics?: boolean;
  withLabels?: boolean;
  topic?: Topic | null;
  onTopic?: (topic: Topic) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [chosen, setChosen] = useState<Topic | null>(topic ?? null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (topic) setChosen(topic);
  }, [topic]);

  function pick(t: Topic) {
    setChosen(t);
    onTopic?.(t);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setState("error");
      setNote("Please add your name, your email and a message.");
      return;
    }
    setState("sending");
    setNote("");
    try {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          message: chosen ? `About: ${chosen}\n\n${form.message}` : form.message,
        }),
      });
      if (!response.ok) throw new Error();
      setState("sent");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      setState("error");
      setNote("That didn't send. Try again, or email me directly at adebisireuel@gmail.com.");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex min-h-[320px] flex-col items-start justify-center gap-4" role="status">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-black">
          <Check className="h-5 w-5" />
        </span>
        <p className="text-[24px] font-bold tracking-[-0.02em]">Message sent.</p>
        <p className="max-w-sm text-[15px] leading-[1.6] text-text-secondary">
          Thank you. It&apos;s in my inbox now, and I reply within a day.
        </p>
        <button type="button" onClick={() => setState("idle")} className="text-[13px] font-semibold underline underline-offset-4">
          Send another
        </button>
      </div>
    );
  }

  const label = (text: string) =>
    withLabels ? <span className="mb-2 block text-[13px] font-medium">{text}</span> : <span className="sr-only">{text}</span>;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {/* honeypot: the API drops anything that fills it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />

      {withTopics ? (
        <div>
          <span className="mb-2 block text-[13px] font-medium">What&apos;s it about?</span>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="What's it about?">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={chosen === t}
                onClick={() => pick(t)}
                className={`min-h-[36px] border px-3 text-[13px] font-medium transition-colors ${
                  chosen === t ? "border-ink bg-ink text-bg" : "border-border bg-white/70 text-text-secondary hover:border-ink hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className={withLabels ? "grid gap-4 sm:grid-cols-2" : "space-y-3"}>
        <label className="block">
          {label("Your name")}
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={field}
            placeholder={withLabels ? "" : "Your name"}
          />
        </label>
        <label className="block">
          {label("Your email")}
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={field}
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        {label("Your message")}
        <textarea
          rows={withLabels ? 6 : 4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${field} resize-none`}
          placeholder={
            chosen === "A role on your team"
              ? "The role, the team, and what you'd want me to work on"
              : "The product, who it's for, and what isn't working yet"
          }
        />
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-bg transition-opacity hover:bg-ink/85 disabled:opacity-60"
      >
        {state === "sending" ? "Sending" : "Send message"} <ArrowRight className="h-4 w-4" />
      </button>
      {state === "error" && note ? (
        <p className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-[13px] text-red-800" role="alert">
          {note}
        </p>
      ) : null}
    </form>
  );
}
