"use client";

import type { ReactNode } from "react";

/* The Playground's controls (2026-11-03): a slider with its number beside it (type a value or
   drag), a row of options, and a titled group. Same language as the site: hairlines, Inter,
   black for the chosen thing, the aqua accent only as a fill. */

export function Group({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary">{title}</h3>
        {aside}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium">{label}</span>
        <span className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChange(clamp(v));
            }}
            className="w-[64px] border border-border bg-white px-2 py-1 text-right text-[13px] tabular-nums outline-none focus:border-ink"
            aria-label={`${label} value`}
          />
          {suffix ? <span className="w-3 text-[12px] text-text-tertiary">{suffix}</span> : null}
        </span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="playground-range mt-2 w-full"
        aria-label={label}
      />
    </label>
  );
}

export function Options<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      {label ? <span className="mb-2 block text-[13px] font-medium">{label}</span> : null}
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`min-h-[34px] border px-3 text-[13px] font-medium transition-colors ${
              value === o.value ? "border-ink bg-ink text-bg" : "border-border bg-white text-text-secondary hover:border-ink hover:text-text"
            }`}
          >
            {o.label}
            {o.hint ? <span className={`ml-1.5 text-[11px] ${value === o.value ? "text-bg/60" : "text-text-tertiary"}`}>{o.hint}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  tone = "secondary",
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "primary" | "secondary";
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex min-h-[42px] items-center justify-center gap-2 px-4 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        tone === "primary" ? "bg-ink text-bg hover:bg-ink/85" : "border border-border bg-white hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
