"use client";

import { motion } from "framer-motion";
import { PartyPopper, Users, CalendarCheck2, Utensils, MessageCircle } from "lucide-react";

const POINTS = [
  { icon: Users, text: "Perfect for weddings, birthdays & family functions" },
  { icon: Utensils, text: "Freshly packed handis, sized for any guest list" },
  { icon: CalendarCheck2, text: "Please book at least 3 hours in advance" },
];

export default function BulkOrders() {
  return (
    <section className="full-bleed relative z-10 overflow-hidden bg-gradient-to-br from-[#3a1710] via-[#5c1620] to-[#2a1608] px-5 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-maroon-bright/25 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left"
      >
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
            <PartyPopper size={24} className="text-gold" />
          </span>
          <div>
            <div className="divider-ornament mb-3 justify-center text-xs font-semibold tracking-[0.4em] text-gold lg:justify-start">
              PLANNING SOMETHING BIG?
            </div>
            <h2 className="font-display text-2xl font-bold uppercase text-white sm:text-3xl">
              Bulk &amp; Party Orders
            </h2>
          </div>

          <ul className="flex flex-col gap-2.5">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <p.icon size={13} className="text-gold-bright" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://wa.me/917330922131?text=Hi%2C%20I%27d%20like%20to%20place%20a%20bulk%2Fparty%20order%20for%20Bakasura%20Biryani.%20Could%20you%20share%20details%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-9 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:scale-105"
        >
          <MessageCircle size={17} />
          Enquire for Bulk Orders
        </a>
      </motion.div>
    </section>
  );
}
