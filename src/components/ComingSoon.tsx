"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Heart } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.45 9.96-9.95S17.54 2 12.04 2zm0 18.2h-.01a8.26 8.26 0 0 1-4.21-1.15l-.3-.18-3.09.81.82-3-.2-.31a8.24 8.24 0 0 1-1.27-4.4c0-4.55 3.7-8.25 8.26-8.25 2.2 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.84c0 4.55-3.71 8.26-8.26 8.26zm4.53-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

export default function ComingSoon() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      <AnimatedBackground />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-maroon-bright/15 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald/15 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-gold/25 blur-[90px]" />
        <Image
          src="/images/logo-transparent.png"
          alt="Bakasura Biryani"
          width={340}
          height={340}
          priority
          className="w-52 drop-shadow-[0_20px_40px_rgba(42,22,8,0.22)] sm:w-64 md:w-72"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 mt-8"
      >
        <div className="divider-ornament mb-4 text-xs font-semibold tracking-[0.4em] text-gold-deep">
          OPENING SOON
        </div>
        <h1 className="font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl md:text-5xl">
          We Open <span className="text-gold-gradient">August 9th</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
        className="relative z-10 mt-12 flex flex-col items-center gap-3 text-sm text-cocoa/85"
      >
        <div className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-gold-deep" />
          <span>2-6-1533, NGO&apos;s Colony Road, Opp: Thirumala Bar, Gokul Nagar Junction, Hanamkonda - 506001</span>
        </div>
        <a href="tel:+917330922131" className="flex items-center gap-2 transition hover:text-gold-deep">
          <Phone size={15} className="text-gold-deep" />
          <span>+91 73309 22131</span>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 mt-8 flex gap-3"
      >
        <a
          href="https://wa.me/917330922131"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-deep/30 text-gold-deep/90 transition hover:border-gold-deep hover:bg-gold/10 hover:text-gold-deep"
        >
          <WhatsAppIcon width={18} height={18} />
        </a>
        <a
          href="https://www.instagram.com/bakasurabiryani/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-deep/30 text-gold-deep/90 transition hover:border-gold-deep hover:bg-gold/10 hover:text-gold-deep"
        >
          <InstagramIcon width={18} height={18} />
        </a>
        <a
          href="https://www.facebook.com/bakasurabiryani"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-deep/30 text-gold-deep/90 transition hover:border-gold-deep hover:bg-gold/10 hover:text-gold-deep"
        >
          <FacebookIcon width={18} height={18} />
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="relative z-10 mt-12 flex items-center gap-1.5 text-xs text-cocoa/60"
      >
        Designed &amp; Developed by
        <a
          href="https://nevatrix.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-cocoa/80 transition hover:text-gold-deep"
        >
          Nevatrix
        </a>
        <Heart size={12} className="fill-maroon-bright text-maroon-bright" />
      </motion.p>
    </main>
  );
}
