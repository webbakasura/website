"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, Lock } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-br from-maroon-bright via-[#7a1f2b] to-gold-deep px-5 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gold-bright/20 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-xl text-center"
      >
        <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-white/80">
          STAY CONNECTED
        </div>
        <h2 className="font-display text-2xl font-bold uppercase text-white sm:text-3xl">
          Subscribe &amp; Get Exclusive Deals
        </h2>

        {status === "success" ? (
          <div className="mt-7 flex flex-col items-center gap-2 text-white">
            <CheckCircle2 size={26} />
            <p className="text-sm font-semibold">You&apos;re on the list — thank you!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="email"
                required
                maxLength={200}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-white/20 bg-white/95 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-white"
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send size={15} />
              {status === "submitting" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-white/90">{errorMsg}</p>
        )}

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
          <Lock size={12} />
          No spam, unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
