"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, Clock, Navigation, Bike, Timer } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "./icons";

const ADDRESS =
  "2-6-1533, NGO's Colony Road, Opp: Thirumala Bar, Gokul Nagar Junction, Hanumakonda - 506001";
const PHONE_DISPLAY = "+91 73309 22131";
const PHONE_TEL = "+917330922131";
const PHONE_WA = "917330922131";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const CARDS = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [ADDRESS],
    action: { label: "Get Directions", href: MAPS_URL, external: true, icon: Navigation },
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: [PHONE_DISPLAY],
    action: { label: "Call Now", href: `tel:${PHONE_TEL}`, external: false, icon: Phone },
  },
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    lines: [PHONE_DISPLAY],
    action: { label: "Message Us", href: `https://wa.me/${PHONE_WA}`, external: true, icon: WhatsAppIcon },
  },
  {
    icon: Clock,
    title: "Hours",
    lines: ["12:00 PM – 3:00 PM", "6:00 PM – 9:00 PM, Daily"],
    action: null,
  },
  {
    icon: Bike,
    title: "Home Delivery",
    lines: ["Minimum 5 orders", "for home delivery"],
    action: null,
  },
  {
    icon: Timer,
    title: "Bulk Orders",
    lines: ["Please place your order", "at least 3 hours in advance"],
    action: null,
  },
];

export default function ContactPage() {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="relative z-10 mt-8"
      >
        <div className="divider-ornament mb-4 text-xs font-semibold tracking-[0.4em] text-gold-deep">
          GET IN TOUCH
        </div>
        <h1 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl md:text-4xl">
          Contact <span className="text-gold-gradient">Us</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cocoa/75 sm:text-base">
          Questions, catering requests, or just want to say hello? We&apos;re here.
        </p>
      </motion.div>

      <div className="relative z-10 mt-12 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: "easeOut" }}
            className="card-glass flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 ring-1 ring-gold-deep/25">
              <card.icon size={20} className="text-gold-deep" />
            </div>
            <p className="font-display text-base font-bold text-ink">{card.title}</p>
            <div className="text-sm leading-relaxed text-cocoa/75">
              {card.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {card.action && (
              <a
                href={card.action.href}
                target={card.action.external ? "_blank" : undefined}
                rel={card.action.external ? "noopener noreferrer" : undefined}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold-deep/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gold-deep transition hover:border-gold-deep hover:bg-gold/10"
              >
                <card.action.icon size={13} />
                {card.action.label}
              </a>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="relative z-10 mt-10 flex gap-3"
      >
        <a
          href={`https://wa.me/${PHONE_WA}`}
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
    </main>
    <Footer />
    </>
  );
}
