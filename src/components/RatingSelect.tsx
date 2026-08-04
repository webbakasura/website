"use client";

import { Frown, Meh, Smile, PartyPopper, MinusCircle } from "lucide-react";

export const RATING_OPTIONS = ["Poor", "Fair", "Good", "Excellent"] as const;
export type RatingValue = (typeof RATING_OPTIONS)[number];

const OPTION_STYLE: Record<RatingValue, { icon: typeof Frown; active: string; idle: string }> = {
  Poor: {
    icon: Frown,
    active: "border-maroon-bright bg-maroon-bright text-white shadow-[0_4px_14px_rgba(156,44,58,0.35)]",
    idle: "border-maroon-bright/25 bg-white/50 text-cocoa/70 hover:border-maroon-bright/50 hover:text-maroon-bright",
  },
  Fair: {
    icon: Meh,
    active: "border-terracotta bg-terracotta text-white shadow-[0_4px_14px_rgba(199,107,31,0.35)]",
    idle: "border-terracotta/25 bg-white/50 text-cocoa/70 hover:border-terracotta/50 hover:text-terracotta",
  },
  Good: {
    icon: Smile,
    active: "border-gold-deep bg-gold-deep text-white shadow-[0_4px_14px_rgba(156,107,14,0.35)]",
    idle: "border-gold-deep/25 bg-white/50 text-cocoa/70 hover:border-gold-deep/50 hover:text-gold-deep",
  },
  Excellent: {
    icon: PartyPopper,
    active: "border-emerald bg-emerald text-white shadow-[0_4px_14px_rgba(31,74,48,0.35)]",
    idle: "border-emerald/25 bg-white/50 text-cocoa/70 hover:border-emerald/50 hover:text-emerald",
  },
  "N/A": {
    icon: MinusCircle,
    active: "border-cocoa bg-cocoa text-white shadow-[0_4px_14px_rgba(107,74,53,0.3)]",
    idle: "border-cocoa/25 bg-white/50 text-cocoa/60 hover:border-cocoa/50 hover:text-cocoa",
  },
};

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
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
          {label}
        </span>
        {value && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {RATING_OPTIONS.map((opt) => {
          const selected = value === opt;
          const style = OPTION_STYLE[opt];
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                selected ? style.active : style.idle
              }`}
            >
              <style.icon size={13} />
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
