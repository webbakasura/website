"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, User, Phone, MessageSquare, Sparkles } from "lucide-react";
import RatingSelect, { RatingValue } from "./RatingSelect";

type Status = "idle" | "submitting" | "success" | "error";

const RATING_FIELDS = [
  { key: "qualityRating", label: "Quality of Food" },
  { key: "quantityRating", label: "Quantity of Food" },
  { key: "tasteRating", label: "Taste" },
  { key: "temperatureRating", label: "Temperature of Food" },
  { key: "speedRating", label: "Speed of Service" },
  { key: "overallRating", label: "Overall Rating" },
] as const;

type RatingKey = (typeof RATING_FIELDS)[number]["key"];
type Ratings = Record<RatingKey, RatingValue | null>;

const EMPTY_RATINGS: Ratings = {
  qualityRating: null,
  quantityRating: null,
  tasteRating: null,
  temperatureRating: null,
  speedRating: null,
  overallRating: null,
};

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [ratings, setRatings] = useState<Ratings>(EMPTY_RATINGS);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const ratedCount = RATING_FIELDS.filter((f) => ratings[f.key] !== null).length;
  const ratingsComplete = ratedCount === RATING_FIELDS.length;

  function setRating(key: RatingKey, value: RatingValue) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !ratingsComplete) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          ...ratings,
          website,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setContact("");
      setMessage("");
      setRatings(EMPTY_RATINGS);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card-glass relative mx-auto flex max-w-md flex-col items-center gap-3 overflow-hidden rounded-3xl px-6 py-10 text-center"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,74,48,0.12),transparent_60%)]" />
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute"
            style={{ left: `${12 + i * 15}%`, top: "10%" }}
            initial={{ opacity: 0, y: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], y: 90, rotate: 180 }}
            transition={{ duration: 1.6, delay: i * 0.08, ease: "easeOut" }}
          >
            <Sparkles size={14} className={i % 2 === 0 ? "text-gold-deep" : "text-emerald"} />
          </motion.span>
        ))}
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/15 ring-1 ring-emerald/30">
          <CheckCircle2 className="text-emerald" size={32} />
        </span>
        <p className="font-display text-xl font-bold text-ink">Thank You!</p>
        <p className="text-sm text-cocoa/75">
          Your review has reached the kitchen. We appreciate you taking the
          time to share it.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-semibold text-gold-deep transition hover:text-maroon-bright"
        >
          Share another review
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glass grid w-full grid-cols-1 gap-8 rounded-3xl px-6 py-8 text-left shadow-[0_20px_50px_rgba(122,31,43,0.08)] sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-10"
    >
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {/* Left: ratings */}
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold text-ink">How Was Your Biryani?</p>
            <p className="mt-1 text-sm text-cocoa/70">
              Rate your experience and let us know how we did.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold-deep ring-1 ring-gold-deep/25">
            {ratedCount}/{RATING_FIELDS.length}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gold-deep/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-emerald"
            animate={{ width: `${(ratedCount / RATING_FIELDS.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-gold-deep/20 bg-white/40 px-4 py-4 sm:px-5">
          {RATING_FIELDS.map((f) => (
            <RatingSelect
              key={f.key}
              label={f.label}
              value={ratings[f.key]}
              onChange={(v) => setRating(f.key, v)}
            />
          ))}
        </div>
      </div>

      {/* Right: contact details */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fb-name" className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Name
          </label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
            <input
              id="fb-name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-cocoa/40 outline-none transition focus:border-gold-deep"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="fb-contact" className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Phone or Email (optional)
          </label>
          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
            <input
              id="fb-contact"
              type="text"
              maxLength={150}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="So we can reply"
              className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-cocoa/40 outline-none transition focus:border-gold-deep"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="fb-message" className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Comments (optional)
          </label>
          <div className="relative flex-1">
            <MessageSquare size={16} className="pointer-events-none absolute left-4 top-4 text-gold-deep/50" />
            <textarea
              id="fb-message"
              maxLength={2000}
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your experience"
              className="min-h-[8rem] w-full resize-none rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-cocoa/40 outline-none transition focus:border-gold-deep"
            />
          </div>
        </div>

        {status === "error" && (
          <p className="text-sm text-maroon-bright">{errorMsg}</p>
        )}
        {status !== "error" && !ratingsComplete && (
          <p className="text-xs text-cocoa/50">
            {RATING_FIELDS.length - ratedCount} more categor
            {RATING_FIELDS.length - ratedCount === 1 ? "y" : "ies"} to rate before submitting.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting" || !ratingsComplete}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink shadow-[0_10px_25px_rgba(156,107,14,0.25)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send size={16} />
          {status === "submitting" ? "Sending..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
