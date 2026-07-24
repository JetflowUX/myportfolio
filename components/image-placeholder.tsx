import { ImageOff } from "lucide-react";

/**
 * Neutral "no image" fill for when a project has no image set. Sits inside a
 * `relative` container (absolute inset-0). Used instead of a hardcoded stock
 * photo so a deleted/blank image reads as genuinely empty, not stuck.
 */
export function ImagePlaceholder({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/[0.04]">
      <ImageOff className="h-6 w-6 text-text-tertiary/50" strokeWidth={1.5} />
      {label ? (
        <span className="text-[8px] uppercase tracking-[0.28em] text-text-tertiary/60 font-mono">
          {label}
        </span>
      ) : null}
    </div>
  );
}
