"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export default function DeliveryPlatforms() {
  return (
    <section className="relative z-10 px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card-glass mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3 rounded-full px-6 py-3.5 text-center sm:gap-4"
      >
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cocoa/80">
          <Truck size={16} className="text-gold-deep" />
          Now delivering on
        </span>
        <span className="inline-flex items-center rounded-full bg-[#FC8019]/15 px-4 py-1.5 text-sm font-bold text-[#FC8019]">
          Swiggy
        </span>
        <span className="inline-flex items-center rounded-full bg-[#E23744]/15 px-4 py-1.5 text-sm font-bold text-[#E23744]">
          Zomato
        </span>
      </motion.div>
    </section>
  );
}
