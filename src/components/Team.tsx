"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ChefHat, UtensilsCrossed } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    label: "100% Hygienic Kitchen",
    iconBg: "bg-emerald/15 ring-emerald/30",
    iconColor: "text-emerald",
  },
  {
    icon: ChefHat,
    label: "Home-Made Recipes",
    iconBg: "bg-gold/10 ring-gold-deep/25",
    iconColor: "text-gold-deep",
  },
  {
    icon: UtensilsCrossed,
    label: "Rich, Authentic Taste",
    iconBg: "bg-maroon-bright/10 ring-maroon-bright/30",
    iconColor: "text-maroon-bright",
  },
];

export default function Team() {
  return (
    <section className="full-bleed relative z-10 overflow-hidden border-y border-gold-deep/15 bg-gradient-to-b from-paper-soft via-gold/5 to-paper-soft px-5 py-16 sm:py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gold/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
          THE TEAM BEHIND IT
        </div>
        <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
          Made With <span className="text-gold-gradient">Love</span>, By Home Cooks
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-cocoa/80 sm:text-base">
          Bakasura Biryani is a home-kitchen brand at heart. Every biryani is
          prepared fresh by our small, dedicated home-cooking team using
          recipes perfected in our own kitchen — no shortcuts, no
          compromises.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          {POINTS.map((p) => (
            <div key={p.label} className="flex items-center gap-2.5">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ${p.iconBg}`}>
                <p.icon size={16} className={p.iconColor} />
              </span>
              <span className="text-sm font-semibold text-cocoa/80">{p.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
