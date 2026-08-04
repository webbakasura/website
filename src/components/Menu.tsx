"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

type Dish = {
  name: string;
  desc: string;
  spice: 1 | 2 | 3;
  tag?: string;
  tone: string;
  image?: string;
  comingSoon?: boolean;
};

const DISHES: Dish[] = [
  {
    name: "Bakasura Aroma Home Made Biryani",
    desc: "Slow dum-cooked chicken, saffron rice, fried onions & royal spice blend.",
    spice: 2,
    tag: "Popular",
    tone: "from-[#c76b1f] via-[#a8471c] to-[#5c1620]",
    image: "/images/chicken-biryani.jpg",
  },
  {
    name: "Mutton Dum Biryani",
    desc: "Tender mutton, hand-pounded masala, hours of slow charcoal cooking.",
    spice: 3,
    tone: "from-[#8a2f1f] via-[#6b1c22] to-[#2f0e12]",
    image: "/images/mutton-biryani.jpg",
    comingSoon: true,
  },
  {
    name: "Egg Biryani",
    desc: "Boiled eggs simmered in a rich onion-tomato masala with basmati.",
    spice: 1,
    tone: "from-[#d3a13a] via-[#a8781f] to-[#5c3a10]",
    image: "/images/egg-biryani.jpg",
    comingSoon: true,
  },
];

function DishPlate({ tone, muted }: { tone: string; muted?: boolean }) {
  return (
    <div className={`relative mx-auto h-32 w-32 shrink-0 sm:h-36 sm:w-36 ${muted ? "grayscale-[55%] opacity-80" : ""}`}>
      <div className="absolute inset-0 rounded-full bg-gold-deep/15 blur-xl" />
      <div className="absolute inset-0 rounded-full border border-gold-deep/25" />
      <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${tone} shadow-inner`} />
      <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.3),transparent_55%)]" />
      <span className="absolute left-[30%] top-[28%] h-1.5 w-3 rotate-12 rounded-full bg-emerald-400/80" />
      <span className="absolute left-[55%] top-[62%] h-1.5 w-2.5 -rotate-12 rounded-full bg-emerald-400/70" />
      <span className="absolute left-[62%] top-[32%] h-2 w-2 rounded-full bg-[#3a1f0d]" />
      <span className="absolute left-[38%] top-[58%] h-2 w-2 rounded-full bg-[#3a1f0d]/80" />
      <span className="absolute left-[48%] top-[45%] h-2.5 w-2.5 rounded-full bg-cream/70" />
    </div>
  );
}

function DishPhoto({ src, alt, muted }: { src: string; alt: string; muted?: boolean }) {
  return (
    <div className={`relative mx-auto h-32 w-32 shrink-0 sm:h-36 sm:w-36 ${muted ? "grayscale-[55%] opacity-80" : ""}`}>
      <div className="absolute inset-0 rounded-full bg-gold-deep/20 blur-xl" />
      <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-gold-deep/25">
        <Image src={src} alt={alt} fill sizes="144px" className="object-cover" />
      </div>
    </div>
  );
}

export default function Menu() {
  return (
    <section id="menu" className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
            OUR DELICIOUS
          </div>
          <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
            The Royal <span className="text-gold-gradient">Menu</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cocoa/75 sm:text-base">
            Every dish is made fresh to order and sealed in a handi for that
            first legendary waft of aroma.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((dish, i) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: "easeOut" }}
              className="card-glass group relative flex flex-col items-center rounded-3xl p-6 text-center transition hover:-translate-y-1.5 hover:border-gold-deep/45"
            >
              {dish.comingSoon ? (
                <span className="absolute right-4 top-4 rounded-full bg-cocoa px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Coming Soon
                </span>
              ) : (
                dish.tag && (
                  <span className="absolute right-4 top-4 rounded-full bg-maroon-bright px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {dish.tag}
                  </span>
                )
              )}
              {dish.image ? (
                <DishPhoto src={dish.image} alt={dish.name} muted={dish.comingSoon} />
              ) : (
                <DishPlate tone={dish.tone} muted={dish.comingSoon} />
              )}
              <h3 className="mt-5 font-display text-base font-bold text-ink sm:text-lg">
                {dish.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-cocoa/70 sm:text-sm">
                {dish.desc}
              </p>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: dish.spice }).map((_, idx) => (
                  <Flame key={idx} size={12} className="fill-maroon-bright text-maroon-bright" />
                ))}
              </div>
              <div className="mt-5 w-full border-t border-gold-deep/15 pt-4">
                {dish.comingSoon ? (
                  <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-cocoa/25 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cocoa/50">
                    Coming Soon
                  </span>
                ) : (
                  <a
                    href={`https://wa.me/917330922131?text=${encodeURIComponent(
                      `Hi, I'd like to order ${dish.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-gold-deep/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gold-deep transition group-hover:border-gold-deep group-hover:bg-gold-deep group-hover:text-white"
                  >
                    Order on WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
