"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#story" },
  { label: "Menu", href: "/#menu" },
  { label: "Contact Us", href: "/contact" },
  { label: "Feedback", href: "/feedback" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold-deep/15 bg-paper/85 backdrop-blur-md shadow-[0_4px_20px_rgba(122,31,43,0.06)]"
          : "bg-gradient-to-b from-paper/60 to-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-gold-deep/30">
            <Image
              src="/images/logo-transparent-v2.png"
              alt="Bakasura Biryani"
              fill
              sizes="40px"
              className="object-cover scale-125"
            />
          </div>
          <span className="font-display text-sm font-bold tracking-wide text-ink">
            BAKASURA
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition hover:text-gold-deep ${
                pathname === link.href ? "text-gold-deep" : "text-cocoa/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-gold-deep md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold-deep/15 bg-paper/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-2 py-2.5 text-sm font-medium transition hover:bg-gold/10 hover:text-gold-deep ${
                  pathname === link.href ? "text-gold-deep" : "text-cocoa/85"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
