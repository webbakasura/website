"use client";

export const RATING_OPTIONS = ["Poor", "Fair", "Good", "Excellent", "N/A"] as const;
export type RatingValue = (typeof RATING_OPTIONS)[number];

export default function RatingSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RatingValue | null;
  onChange: (v: RatingValue) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {RATING_OPTIONS.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={selected}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selected
                  ? "border-gold-deep bg-gold-deep text-white shadow-[0_4px_12px_rgba(156,107,14,0.3)]"
                  : "border-gold-deep/25 bg-white/50 text-cocoa/70 hover:border-gold-deep/50 hover:text-gold-deep"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
