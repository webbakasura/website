"use client";

import { motion } from "framer-motion";
import { CalendarDays, Gift, GraduationCap, Building2, HeartHandshake, Boxes } from "lucide-react";

const DISCOUNTS = [
  { icon: GraduationCap, label: "Students" },
  { icon: Building2, label: "Hostel Students" },
  { icon: HeartHandshake, label: "Couples" },
  { icon: Boxes, label: "10+ Orders" },
];

export default function Offers() {
  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
            GRAND OPENING · AUGUST 9TH, 2026
          </div>
          <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
            Opening <span className="text-gold-gradient">Offers</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="card-glass flex flex-col items-center justify-center gap-2 rounded-3xl px-8 py-10 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-cocoa/60">
              Every Biryani
            </span>
            <span className="font-display text-5xl font-bold text-gold-gradient sm:text-6xl">
              ₹100
            </span>
            <span className="text-sm text-cocoa/70">Just ₹100 only, per box</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-maroon-bright to-[#5c1620] px-8 py-10 text-center text-white shadow-[0_10px_30px_rgba(122,31,43,0.25)]"
          >
            <Gift size={22} className="text-gold" />
            <span className="font-display text-lg font-bold uppercase sm:text-xl">
              Opening Day Offer
            </span>
            <span className="text-2xl font-bold text-gold-bright sm:text-3xl">
              Buy 3, Get 1 Free
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/70">
              <CalendarDays size={13} />
              Opening day only — August 9th, 2026
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="card-glass mt-6 rounded-3xl px-6 py-8 sm:px-10"
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {DISCOUNTS.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold-deep/25">
                  <d.icon size={20} className="text-gold-deep" />
                </span>
                <span className="font-display text-xl font-bold text-gold-gradient">10% Off</span>
                <span className="text-xs font-semibold text-cocoa/70">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] text-cocoa/50">
            *Terms &amp; conditions apply. Offers valid at our Hanumakonda location.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
