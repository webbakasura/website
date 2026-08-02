"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

export default function Reviews() {
  return (
    <section className="relative z-10 px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
          CUSTOMER REVIEWS
        </div>
        <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
          Fresh Out of the <span className="text-gold-gradient">Kitchen</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="card-glass mt-9 flex flex-col items-center gap-4 rounded-3xl px-8 py-10"
        >
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} className="text-gold-deep/30" />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-cocoa/80 sm:text-base">
            We&apos;re brand new in the kitchen — no reviews yet, but
            we&apos;d love for you to be our very first.
          </p>
          <Link
            href="/feedback"
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold-deep/35 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-gold-deep transition hover:border-gold-deep hover:bg-gold/10"
          >
            Leave the First Review
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
