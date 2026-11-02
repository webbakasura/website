"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Phone, MapPin, Send, LocateFixed, CheckCircle2, Loader2 } from "lucide-react";

const WHATSAPP_NUMBER = "917330922131";

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

export default function OrderModal({
  open,
  onClose,
  itemName,
  baseMessage,
}: {
  open: boolean;
  onClose: () => void;
  /** e.g. "Mutton Dum Biryani" — used to build the default message. */
  itemName?: string;
  /** Overrides the default "I'd like to order ..." opening line entirely. */
  baseMessage?: string;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function handleShareLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unsupported");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !address.trim()) return;

    const opening = baseMessage || `Hi, I'd like to order ${itemName || "from Bakasura Biryani"}.`;
    const locationLine = coords ? `\nLive Location: https://www.google.com/maps?q=${coords.lat},${coords.lng}` : "";
    const message = `${opening}\n\nName: ${name.trim()}\nMobile: ${mobile.trim()}\nAddress: ${address.trim()}${locationLine}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");

    setName("");
    setMobile("");
    setAddress("");
    setCoords(null);
    setLocationStatus("idle");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-gold-deep/20 bg-paper px-7 py-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-cocoa/50 transition hover:bg-black/5 hover:text-ink"
            >
              <X size={18} />
            </button>

            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 ring-1 ring-[#25D366]/30">
              <Send size={18} className="text-[#25D366]" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink">
                {itemName ? `Order ${itemName}` : "Place Your Order"}
              </p>
              <p className="mt-1 text-sm text-cocoa/70">
                A few details so we can get your order to you — we&apos;ll open WhatsApp with everything filled in.
              </p>
            </div>

            <div className="relative w-full">
              <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-gold-deep"
              />
            </div>
            <div className="relative w-full">
              <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile number"
                className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-gold-deep"
              />
            </div>
            <div className="relative w-full">
              <MapPin size={16} className="pointer-events-none absolute left-4 top-3.5 text-gold-deep/50" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address / location"
                className="w-full resize-none rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-gold-deep"
              />
            </div>

            <div>
              {locationStatus === "granted" ? (
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald">
                  <CheckCircle2 size={14} />
                  Live location added
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleShareLocation}
                  disabled={locationStatus === "loading"}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold-deep/25 px-4 py-2 text-xs font-semibold text-gold-deep transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                  {locationStatus === "loading" ? "Getting your location..." : "Share My Live Location (optional)"}
                </button>
              )}
              {locationStatus === "denied" && (
                <p className="mt-1.5 text-xs text-maroon-bright">Couldn&apos;t access your location — your typed address will be used instead.</p>
              )}
              {locationStatus === "unsupported" && (
                <p className="mt-1.5 text-xs text-maroon-bright">Live location isn&apos;t supported on this browser.</p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C4A] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:scale-[1.02]"
            >
              <Send size={15} />
              Continue on WhatsApp
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
