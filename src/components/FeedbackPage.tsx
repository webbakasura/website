"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
        <div className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-gold/25 blur-[70px]" />
        <Image
          src="/images/logo-transparent-v2.png"
          alt="Bakasura Biryani"
          width={200}
          height={200}
          priority
          className="w-24 drop-shadow-[0_15px_30px_rgba(42,22,8,0.2)] sm:w-28"
        />
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
          A quick review helps us keep every plate fit for a king.
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
