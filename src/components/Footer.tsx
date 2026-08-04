"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Heart } from "lucide-react";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "./icons";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Contact Us", href: "/contact" },
  { label: "Feedback", href: "/feedback" },
];

const SOCIALS = [
  { Icon: WhatsAppIcon, href: "https://wa.me/917330922131", label: "WhatsApp", color: "#25D366" },
  { Icon: InstagramIcon, href: "https://www.instagram.com/bakasurabiryani/", label: "Instagram", color: "#E1306C" },
  { Icon: FacebookIcon, href: "https://www.facebook.com/bakasurabiryani", label: "Facebook", color: "#1877F2" },
];

export default function Footer() {
  return (
    <footer className="full-bleed relative z-10 mt-16 border-t border-gold-deep/15 bg-paper-soft/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16"
      >
        <div className="grid grid-cols-1 gap-10 text-left sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-gold-deep/30">
                <Image
                  src="/images/logo-transparent-v2.png"
                  alt="Bakasura Biryani"
                  fill
                  sizes="44px"
                  className="scale-125 object-cover"
                />
              </div>
              <span className="font-display text-sm font-bold tracking-wide text-ink">
                BAKASURA BIRYANI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cocoa/70">
              Royal dum-cooked biryani, slow-simmered with a secret spice blend. Once you
              start, you can&apos;t stop.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ color, borderColor: `${color}4D` }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition hover:opacity-80"
                >
                  <Icon width={15} height={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-ink">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cocoa/75 transition hover:text-gold-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-ink">
              Visit Us
            </p>
            <p className="mt-3 text-sm font-semibold text-gold-deep">
              Prop: Kanna Vijaya Laxmi
            </p>
            <ul className="mt-2 space-y-3 text-sm text-cocoa/75">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-maroon-bright" />
                <span>
                  2-6-1533, NGO&apos;s Colony Road, Opp: Thirumala Bar, Gokul Nagar
                  Junction, Hanumakonda - 506001
                </span>
              </li>
              <li>
                <a
                  href="tel:+917330922131"
                  className="flex items-center gap-2 transition hover:text-teal"
                >
                  <Phone size={15} className="shrink-0 text-teal" />
                  +91 73309 22131
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-gold-deep" />
                12–3 PM &amp; 6–9 PM, Daily
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-gold-deep/15 pt-6 text-xs text-cocoa/55 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Bakasura Biryani. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed &amp; Developed by
            <a
              href="https://nevatrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cocoa/75 transition hover:text-gold-deep"
            >
              Nevatrix
            </a>
            <Heart size={11} className="fill-maroon-bright text-maroon-bright" />
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
