"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Flame } from "lucide-react";

export default function HoursBanner() {
  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-br from-[#0f2417] via-[#16281a] to-[#2a1608] px-5 py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
            <Clock size={20} className="text-gold" />
          </span>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              Open Daily
            </p>
            <p className="text-sm text-white/70">11:00 AM – 11:00 PM</p>
          </div>
        </div>

        <a
          href="https://wa.me/917330922131?text=Hi%2C%20I%27d%20like%20to%20order%20Bakasura%20Biryani!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-9 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:scale-105"
        >
          <Flame size={17} />
          Order Now
        </a>

        <div className="flex flex-col items-center gap-2 lg:items-end">
          <a href="tel:+917330922131" className="flex items-center gap-2 text-sm text-white/80 transition hover:text-gold">
            <Phone size={14} className="text-gold" />
            +91 73309 22131
          </a>
          <p className="flex items-center gap-2 text-sm text-white/70">
            <MapPin size={14} className="shrink-0 text-gold" />
            Hanamkonda, Telangana
          </p>
        </div>
      </motion.div>
    </section>
  );
}
