"use client";

import { motion } from "framer-motion";
import { Flame, Crown, Leaf, MessageCircleHeart } from "lucide-react";

const FEATURES = [
  {
    icon: Flame,
    title: "Dum Cooked to Perfection",
    desc: "Sealed handi, slow-cooked over an open flame until every grain is infused with flavor.",
    iconBg: "bg-orange-400/15 ring-orange-400/30",
    iconColor: "text-orange-400",
  },
  {
    icon: Crown,
    title: "Royal Family Recipe",
    desc: "A secret spice blend passed down through generations — never written down, never compromised.",
    iconBg: "bg-gold/15 ring-gold/30",
    iconColor: "text-gold-bright",
  },
  {
    icon: Leaf,
    title: "Farm-Fresh Ingredients",
    desc: "Meat, herbs, and basmati sourced fresh daily. Nothing frozen, nothing left to sit.",
    iconBg: "bg-green-400/15 ring-green-400/30",
    iconColor: "text-green-400",
  },
  {
    icon: MessageCircleHeart,
    title: "Made With Care",
    desc: "Every order is home-made in small batches — not mass-produced in a commercial line.",
    iconBg: "bg-pink-400/15 ring-pink-400/30",
    iconColor: "text-pink-400",
  },
];

export default function WhyUs() {
  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-br from-[#2a1608] via-[#3a1710] to-[#16281a] px-5 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-emerald/20 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold">
            WHY BAKASURA
          </div>
          <h2 className="font-display text-2xl font-bold uppercase text-white sm:text-3xl">
            A Feast Built on <span className="text-gold-gradient">Legend</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="card-glass-dark rounded-2xl p-6 text-center"
            >
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${f.iconBg}`}>
                <f.icon size={20} className={f.iconColor} />
              </div>
              <h3 className="mt-4 font-display text-sm font-bold text-white sm:text-base">
                {f.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
