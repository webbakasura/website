"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Gift, ShoppingBag, Globe } from "lucide-react";
import OrderModal from "./OrderModal";

const TERMS = [
  { icon: ShoppingBag, text: "Takeaway orders only" },
  { icon: Globe, text: "Website / direct orders only" },
  { icon: Gift, text: "Not valid on Swiggy or Zomato" },
];

export default function LuckyCoupon() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <section className="full-bleed relative z-10 overflow-hidden bg-gradient-to-br from-[#2a1608] via-[#5c1620] to-[#3a1710] px-5 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-gold/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-maroon-bright/25 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
          <Ticket size={24} className="text-gold" />
        </span>

        <div className="divider-ornament mb-3 mt-4 justify-center text-xs font-semibold tracking-[0.4em] text-gold">
          A LITTLE THANK YOU
        </div>
        <h2 className="font-display text-2xl font-bold uppercase text-white sm:text-3xl">
          Monthly Lucky <span className="text-gold-gradient">Coupon</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          Every month, we treat <span className="font-bold text-gold-bright">3 of our customers</span> to a{" "}
          <span className="font-bold text-gold-bright">₹1000 coupon</span> — our way of saying thanks for
          ordering with us. No sign-up, no entry needed — just keep ordering, and you might be one of them.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TERMS.map((t) => (
            <div key={t.text} className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/85 sm:text-sm">
              <t.icon size={14} className="shrink-0 text-gold-bright" />
              {t.text}
            </div>
          ))}
        </div>

        <button
          onClick={() => setOrderOpen(true)}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-9 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:scale-105"
        >
          <ShoppingBag size={17} />
          Order Now
        </button>
      </motion.div>

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </section>
  );
}
