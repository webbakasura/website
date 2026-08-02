"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Flame, Crown, Leaf, Sparkles } from "lucide-react";

const BADGES = [
  { icon: Flame, label: "Dum Cooked Fresh" },
  { icon: Crown, label: "Secret Family Recipe" },
  { icon: Leaf, label: "100% Home Made" },
];

const FLOATING_CARDS = [
  {
    icon: Flame,
    title: "Dum Cooked Fresh",
    subtitle: "Slow-cooked to perfection",
    className: "left-0 top-6 sm:-left-4 sm:top-10",
  },
  {
    icon: Crown,
    title: "Secret Recipe",
    subtitle: "Guarded family spice blend",
    className: "right-0 top-1/2 -translate-y-1/2 sm:-right-8",
  },
  {
    icon: Leaf,
    title: "100% Home Made",
    subtitle: "Fresh, never frozen",
    className: "bottom-4 left-4 sm:-bottom-2 sm:left-8",
  },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-16 pt-32 lg:pt-40"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-maroon-bright/15 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald/15 blur-[110px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-10">
        {/* Left column */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-maroon-bright via-gold-deep to-maroon-bright bg-[length:200%_100%] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_6px_18px_rgba(122,31,43,0.25)] animate-shimmer sm:text-xs">
              <Sparkles size={13} className="shrink-0" />
              Home Made Biryani, Cooked Fresh Every Day
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="mt-6"
          >
            <h1 className="font-display text-4xl font-bold uppercase leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              Once You
              <br />
              Start, <span className="text-gold-gradient">You Can&apos;t</span>
              <br />
              <span className="text-gold-gradient">Stop</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cocoa/80 sm:text-base lg:mx-0">
              Legendary dum-cooked biryani, slow-simmered with a royal blend of
              secret spices. Made fresh, made at home, made for a king.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center gap-5 sm:flex-row lg:justify-start"
          >
            <a
              href="https://wa.me/917330922131?text=Hi%2C%20I%27d%20like%20to%20order%20Bakasura%20Biryani!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-ink shadow-[0_10px_30px_rgba(156,107,14,0.3)] transition hover:scale-105"
            >
              <Flame size={17} />
              Order Now
            </a>
            <a
              href="#menu"
              className="group inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:text-gold-deep"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-deep/35 transition group-hover:bg-gold/10">
                <ChevronDown size={16} className="-rotate-90 text-gold-deep" />
              </span>
              View Menu
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:hidden"
          >
            {BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cocoa/70">
                <b.icon size={14} className="text-gold-deep" />
                {b.label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column: visual + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-md"
        >
          <div className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-gold/25 blur-[90px]" />
          <Image
            src="/images/logo-transparent-v2.png"
            alt="Bakasura Biryani"
            width={460}
            height={460}
            priority
            className="mx-auto w-full drop-shadow-[0_25px_50px_rgba(42,22,8,0.25)]"
          />

          {FLOATING_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15, ease: "easeOut" }}
              className={`card-glass absolute hidden items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lg lg:flex ${card.className}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold-deep/25">
                <card.icon size={16} className="text-gold-deep" />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold text-ink">{card.title}</span>
                <span className="block text-[11px] text-cocoa/65">{card.subtitle}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#category"
        aria-label="Scroll to explore"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-gold-deep/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={26} />
      </motion.a>
    </section>
  );
}
