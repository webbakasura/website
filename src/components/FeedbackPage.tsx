"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import FeedbackForm from "./FeedbackForm";
import Footer from "./Footer";

export default function FeedbackPage() {
  return (
    <>
    <main className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-28 text-center">
      <Navbar />
      <AnimatedBackground />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-maroon-bright/15 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-emerald/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cocoa/60 transition hover:text-gold-deep"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="relative z-10 mt-6"
      >
        <div className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-gold/25 blur-2xl" />
        <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-[0_15px_35px_rgba(42,22,8,0.25)] ring-4 ring-paper sm:h-28 sm:w-28">
          <Image
            src="/images/chicken-biryani.jpg"
            alt="Bakasura Biryani"
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>
        <span className="absolute -bottom-1.5 -right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gold-deep text-white shadow-lg ring-4 ring-paper">
          <Star size={16} className="fill-white" />
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="relative z-10 mt-6"
      >
        <div className="divider-ornament mb-4 text-xs font-semibold tracking-[0.4em] text-gold-deep">
          WE&apos;D LOVE TO HEAR
        </div>
        <h1 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl md:text-4xl">
          Share Your <span className="text-gold-gradient">Experience</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cocoa/75 sm:text-base">
          A quick review helps us keep every plate fit for a king. It only
          takes about a minute.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        className="relative z-10 mt-10 w-full max-w-5xl px-2 sm:px-4"
      >
        <FeedbackForm />
      </motion.div>

    </main>
    <Footer />
    </>
  );
}
