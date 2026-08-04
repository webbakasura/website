"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Flame, Leaf, Sparkles } from "lucide-react";

const POINTS = [
  {
    icon: Flame,
    text: "Sealed handi, slow dum-cooked over an open flame",
    iconBg: "bg-terracotta/15 ring-terracotta/30",
    iconColor: "text-terracotta",
  },
  {
    icon: Crown,
    text: "Secret family spice blend, guarded for generations",
    iconBg: "bg-gold/10 ring-gold-deep/25",
    iconColor: "text-gold-deep",
  },
  {
    icon: Leaf,
    text: "Fresh meat, herbs, and basmati sourced daily",
    iconBg: "bg-emerald/15 ring-emerald/30",
    iconColor: "text-emerald",
  },
];

export default function Story() {
  return (
    <section id="story" className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-xs"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gold/25 via-transparent to-maroon-bright/15 blur-2xl" />
          <div className="card-glass relative rounded-[2rem] p-3">
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/logo-v2.png"
                alt="The legend of Bakasura"
                fill
                sizes="(max-width: 1024px) 80vw, 380px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gold-deep/30 bg-paper px-5 py-2 shadow-lg">
            <Sparkles size={14} className="text-gold-deep" />
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-gold-deep">
              The Legend Lives On
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="divider-ornament mb-4 justify-center text-xs font-semibold tracking-[0.4em] text-gold-deep lg:justify-start">
            OUR STORY
          </div>
          <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
            Fit for a <span className="text-gold-gradient">Demon King</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-cocoa/80 sm:text-base">
            Legend tells of Bakasura, a mighty king whose appetite matched his
            legend — a feast was never enough until every last grain was
            devoured. We cook in that same spirit: no half-measures, no
            shortcuts, just an honest, home-made devotion to flavor.
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center justify-center gap-3 text-sm text-cocoa/85 lg:justify-start">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${p.iconBg}`}>
                  <p.icon size={14} className={p.iconColor} />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
