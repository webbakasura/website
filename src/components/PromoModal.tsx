"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gift, Star, Wallet } from "lucide-react";

const SEEN_KEY = "bakasura-referral-promo-seen";

export default function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    sessionStorage.setItem(SEEN_KEY, "1");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold-deep/20 bg-paper px-7 py-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-cocoa/50 transition hover:bg-black/5 hover:text-ink"
            >
              <X size={18} />
            </button>

            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold-deep/25">
              <Gift size={24} className="text-gold-deep" />
            </span>

            <div className="divider-ornament mt-4 mb-2 text-xs font-semibold tracking-[0.4em] text-gold-deep">
              REFER &amp; EARN
            </div>
            <h2 className="font-display text-2xl font-bold uppercase text-ink">
              Bakasura <span className="text-gold-gradient">Rewards</span>
            </h2>
            <p className="mt-1 text-sm text-cocoa/60">రిఫర్ చేయండి &amp; సంపాదించండి</p>

            <div className="mt-6 flex flex-col gap-4 text-left">
              <div className="flex items-start gap-3 rounded-2xl border border-gold-deep/20 bg-paper-soft px-4 py-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald/15 ring-1 ring-emerald/30">
                  <Wallet size={16} className="text-emerald" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-ink">10% Referral Bonus</p>
                  <p className="mt-0.5 text-sm text-cocoa/70">
                    Share your mobile number with friends. When they order and mention it, you earn 10% of their bill — every time they order.
                  </p>
                  <p className="mt-1.5 text-sm text-cocoa/70">
                    మీ మొబైల్ నంబర్‌ను స్నేహితులతో షేర్ చేయండి. వారు ఆర్డర్ చేసి మీ నంబర్ చెప్పినప్పుడు, ప్రతిసారీ వారి బిల్లులో 10% మీకు లభిస్తుంది.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-gold-deep/20 bg-paper-soft px-4 py-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold-deep/30">
                  <Star size={16} className="text-gold-deep" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-ink">+3 Points Per Biryani</p>
                  <p className="mt-0.5 text-sm text-cocoa/70">
                    Every biryani you order earns you loyalty points — just our way of saying thanks for coming back.
                  </p>
                  <p className="mt-1.5 text-sm text-cocoa/70">
                    మీరు ఆర్డర్ చేసే ప్రతి బిర్యానీకి లాయల్టీ పాయింట్లు లభిస్తాయి — మళ్ళీ వచ్చినందుకు ధన్యవాదాలు చెప్పే మా విధానం.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs text-cocoa/50">
              Referral earnings become redeemable as a discount once your balance reaches ₹100 — just ask our staff. No app or card needed, just your mobile number.
            </p>
            <p className="mt-2 text-xs text-cocoa/50">
              మీ బ్యాలెన్స్ ₹100కి చేరుకున్న తర్వాత రిఫరల్ సంపాదన డిస్కౌంట్‌గా వాడుకోవచ్చు — మా సిబ్బందిని అడగండి. యాప్ లేదా కార్డ్ అవసరం లేదు, మీ మొబైల్ నంబర్ మాత్రమే చాలు.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={close}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:scale-[1.02]"
              >
                Got It · సరే
              </button>
              <Link
                href="/account"
                onClick={close}
                className="text-xs font-semibold text-cocoa/60 underline-offset-2 hover:text-gold-deep hover:underline"
              >
                Already a member? View your rewards · ఇప్పటికే సభ్యులా? మీ రివార్డ్స్ చూడండి
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
