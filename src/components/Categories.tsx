"use client";

import { motion } from "framer-motion";
import { Drumstick, Beef, Egg } from "lucide-react";

const CATEGORIES = [
  { icon: Drumstick, label: "Chicken", iconBg: "bg-terracotta/15 ring-terracotta/30 group-hover:bg-terracotta/25", iconColor: "text-terracotta" },
  { icon: Beef, label: "Mutton", iconBg: "bg-maroon-bright/10 ring-maroon-bright/30 group-hover:bg-maroon-bright/20", iconColor: "text-maroon-bright" },
  { icon: Egg, label: "Egg", iconBg: "bg-gold/10 ring-gold-deep/25 group-hover:bg-gold/20", iconColor: "text-gold-deep" },
];

export default function Categories() {
  return (
    <section id="category" className="relative z-10 px-5 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl text-center">
        <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
          WHAT WE OFFER
        </div>
        <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
          Browse by <span className="text-gold-gradient">Category</span>
        </h2>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.label}
              href="#menu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
              className="card-glass group flex flex-col items-center gap-2.5 rounded-2xl px-3 py-6 transition hover:-translate-y-1 hover:border-gold-deep/50"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 transition ${cat.iconBg}`}>
                <cat.icon size={22} className={cat.iconColor} />
              </div>
              <span className="text-xs font-semibold text-cocoa/80 sm:text-sm">
                {cat.label}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
