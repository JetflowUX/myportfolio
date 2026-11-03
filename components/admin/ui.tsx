"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/* The admin's building blocks (2026-11-03). Jethro: "CHANGE THE ADMIN VIES TO SOMETHING GOOD".
   Same language as the public site: warm paper, hairline borders, Inter, the aqua accent only as
   a fill, black as the one strong colour. */

export const inputClass =
  "w-full border border-border bg-white px-3.5 py-2.5 text-[14px] text-text outline-none transition-[border-color,box-shadow] placeholder:text-text-tertiary/70 focus:border-ink focus:shadow-[0_0_0_3px_rgb(var(--accent-rgb)/0.35)] disabled:cursor-not-allowed disabled:bg-ink/[0.03] disabled:text-text-tertiary";

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";

const toneClass: Record<ButtonTone, string> = {
  primary: "bg-ink text-bg hover:bg-ink/85",
  secondary: "border border-border bg-white text-text hover:border-ink",
  ghost: "text-text-secondary hover:bg-ink/[0.05] hover:text-text",
  danger: "text-red-700 hover:bg-red-50",
};

export function Button({
  tone = "secondary",
  busy = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone; busy?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || busy}
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 px-4 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toneClass[tone]} ${className}`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[13px] font-medium text-text">{label}</span>
      {hint ? <span className="mt-0.5 block text-[12px] leading-[1.5] text-text-tertiary">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea({ rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} {...props} className={`${inputClass} resize-y leading-[1.6] ${props.className ?? ""}`} />;
}

/* A switch for a yes/no setting: the whole row is the target. */
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 border border-border bg-white px-3.5 py-3 text-left transition-colors hover:border-ink"
    >
      <span>
        <span className="block text-[14px] font-medium">{label}</span>
        {description ? <span className="mt-0.5 block text-[12px] text-text-tertiary">{description}</span> : null}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-ink" : "bg-ink/15"}`}
        aria-hidden
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full transition-[left] duration-200 ${checked ? "left-6 bg-accent" : "left-1 bg-white"}`}
        />
      </span>
    </button>
  );
}

/* One part of a form: its name and what it is for on the left, the fields on the right. */
export function FormSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="grid scroll-mt-24 gap-6 border-t border-border py-9 md:grid-cols-[220px_1fr] md:gap-10">
      <div>
        <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h3>
        {description ? <p className="mt-1.5 text-[13px] leading-[1.6] text-text-tertiary">{description}</p> : null}
      </div>
      <div className="min-w-0 space-y-5">{children}</div>
    </section>
  );
}

/* An image: what it looks like now, a link to paste, and an upload. */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  onUpload,
  aspect = "aspect-[16/10]",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  aspect?: string;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);

  async function pick(file?: File) {
    if (!file) return;
    setUploading(true);
    const url = await onUpload(file);
    setUploading(false);
    if (url) onChange(url);
  }

  return (
    <div>
      <span className="block text-[13px] font-medium">{label}</span>
      {hint ? <span className="mt-0.5 block text-[12px] text-text-tertiary">{hint}</span> : null}
      <div className="mt-2 grid gap-3 sm:grid-cols-[180px_1fr]">
        <div className={`relative ${aspect} overflow-hidden border border-border bg-ink/[0.03]`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-text-tertiary">
              <ImagePlus className="h-5 w-5" />
            </span>
          )}
          {uploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image link, or upload" />
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 border border-border bg-white px-4 text-[13px] font-semibold transition-colors hover:border-ink"
            >
              <ImagePlus className="h-4 w-4" /> {value ? "Replace" : "Upload"}
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/*,.svg"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                void pick(file);
              }}
            />
            {value ? (
              <Button tone="ghost" onClick={() => onChange("")}>
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Gallery images as thumbnails, each removable, plus an upload for several at once. */
export function GalleryField({
  value,
  onChange,
  onUploadMany,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  onUploadMany: (files: File[]) => Promise<string[]>;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState("");

  return (
    <div>
      <span className="block text-[13px] font-medium">Gallery</span>
      <span className="mt-0.5 block text-[12px] text-text-tertiary">
        Shown on the case study in this order: discovery, structure, wireframes, final screens.
      </span>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="group relative aspect-[4/3] overflow-hidden border border-border bg-ink/[0.03]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <span className="absolute left-1.5 top-1.5 bg-white/90 px-1.5 text-[11px] font-semibold">{i + 1}</span>
            <button
              type="button"
              aria-label={`Remove image ${i + 1}`}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center bg-white/90 opacity-0 transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <label
          htmlFor={inputId}
          className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-ink/25 text-[12px] font-semibold text-text-secondary transition-colors hover:border-ink hover:text-text"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          {uploading ? "Uploading" : "Add images"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*,.svg"
          multiple
          className="sr-only"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (!files.length) return;
            setUploading(true);
            const urls = await onUploadMany(files);
            setUploading(false);
            if (urls.length) onChange([...value, ...urls]);
          }}
        />
      </div>
      <div className="mt-3 flex gap-2">
        <TextInput value={link} onChange={(e) => setLink(e.target.value)} placeholder="Or paste an image link" />
        <Button
          disabled={!link.trim()}
          onClick={() => {
            onChange([...value, link.trim()]);
            setLink("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export type Notice = { text: string; tone: "ok" | "error" | "info" } | null;

/* Saves and errors, in one small notice at the bottom; errors stay until dismissed. */
export function Toast({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const timer = useRef<number>();
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (notice && notice.tone !== "error") timer.current = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timer.current);
  }, [notice, onClose]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {notice ? (
          <motion.div
            key={notice.text}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto flex max-w-[560px] items-start gap-3 px-4 py-3 text-[13px] font-medium shadow-lg ${
              notice.tone === "error" ? "bg-red-700 text-white" : "bg-ink text-bg"
            }`}
          >
            {notice.tone === "error" ? (
              <AlertCircle className="mt-px h-4 w-4 shrink-0" />
            ) : (
              <Check className={`mt-px h-4 w-4 shrink-0 ${notice.tone === "ok" ? "text-accent" : "opacity-60"}`} />
            )}
            <span className="leading-[1.5]">{notice.text}</span>
            <button type="button" aria-label="Dismiss" onClick={onClose} className="-mr-1 ml-1 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
