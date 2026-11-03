"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gift, Star, Wallet, LogIn, Ticket, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import LoginModal from "./LoginModal";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbDj6OgK5cDCzF8Yqx2y";

const REWARDS = [
  {
    stat: "10%",
    icon: Wallet,
    color: "emerald",
    title: "Referral Bonus",
    body: "Share your mobile number with friends. When they order and mention it, you earn 10% of their bill — every time they order.",
    bodyTe:
      "మీ మొబైల్ నంబర్‌ను స్నేహితులతో షేర్ చేయండి. వారు ఆర్డర్ చేసి మీ నంబర్ చెప్పినప్పుడు, ప్రతిసారీ వారి బిల్లులో 10% మీకు లభిస్తుంది.",
  },
  {
    stat: "+3",
    icon: Star,
    color: "gold",
    title: "Points Per Biryani",
    body: "Every biryani you order earns you loyalty points — just our way of saying thanks for coming back.",
    bodyTe: "మీరు ఆర్డర్ చేసే ప్రతి బిర్యానీకి లాయల్టీ పాయింట్లు లభిస్తాయి — మళ్ళీ వచ్చినందుకు ధన్యవాదాలు చెప్పే మా విధానం.",
  },
  {
    stat: "₹1000",
    icon: Ticket,
    color: "maroon",
    title: "Monthly Lucky Coupon",
    body: "Every month, we treat 3 of our customers to a coupon — no sign-up, no entry needed. Takeaway & website orders only, not valid on Swiggy or Zomato.",
    bodyTe:
      "ప్రతి నెలా, మేము మా 3 మంది కస్టమర్లకు కూపన్ అందిస్తాము — సైన్ అప్ అవసరం లేదు. టేకావే & వెబ్‌సైట్ ఆర్డర్లకు మాత్రమే, స్విగ్గీ/జొమాటోలో చెల్లదు.",
  },
] as const;

const COLOR_STYLES: Record<string, { bg: string; border: string; stat: string; iconBg: string; iconRing: string; iconText: string }> = {
  emerald: {
    bg: "bg-emerald/10",
    border: "border-emerald/25",
    stat: "text-emerald",
    iconBg: "bg-emerald/15",
    iconRing: "ring-emerald/30",
    iconText: "text-emerald",
  },
  gold: {
    bg: "bg-gold/10",
    border: "border-gold-deep/25",
    stat: "text-gold-deep",
    iconBg: "bg-gold/20",
    iconRing: "ring-gold-deep/35",
    iconText: "text-gold-deep",
  },
  maroon: {
    bg: "bg-maroon-bright/10",
    border: "border-maroon-bright/30",
    stat: "text-maroon-bright",
    iconBg: "bg-maroon-bright/15",
    iconRing: "ring-maroon-bright/35",
    iconText: "text-maroon-bright",
  },
};

export default function PromoModal() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
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
  }

  return (
    <>
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
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-paper text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/35"
            >
              <X size={18} />
            </button>

            {/* Hero header */}
            <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#2a1608] via-[#5c1620] to-[#9c6b0e] px-7 pb-8 pt-9">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
              <div className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-gold/25 blur-[90px]" />
              <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-maroon-bright/30 blur-[90px]" />

              <motion.span
                initial={{ scale: 0.6, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
                className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 ring-2 ring-gold-bright/50 shadow-[0_0_30px_rgba(227,180,82,0.35)]"
              >
                <Gift size={28} className="text-gold-bright" />
                <Sparkles size={14} className="absolute -right-1 -top-1 text-gold-bright" />
              </motion.span>

              <div className="relative mt-4 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.4em] text-gold-bright">
                <span className="h-px w-8 bg-gold-bright/50" />
                REFER &amp; EARN
                <span className="h-px w-8 bg-gold-bright/50" />
              </div>
              <h2 className="relative mt-2 font-display text-3xl font-bold uppercase text-white sm:text-4xl">
                Bakasura <span className="text-gold-gradient">Rewards</span>
              </h2>
              <p className="relative mt-1 text-sm text-white/70">రిఫర్ చేయండి &amp; సంపాదించండి</p>
            </div>

            {/* Reward cards */}
            <div className="px-7 pb-8 pt-7">
              <div className="grid grid-cols-1 gap-4 text-left lg:grid-cols-3">
                {REWARDS.map((r) => {
                  const c = COLOR_STYLES[r.color];
                  return (
                    <motion.div
                      key={r.title}
                      whileHover={{ y: -3 }}
                      className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} px-5 py-5`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${c.iconBg} ring-1 ${c.iconRing}`}>
                          <r.icon size={18} className={c.iconText} />
                        </span>
                        <span className={`font-display text-3xl font-bold ${c.stat}`}>{r.stat}</span>
                      </div>
                      <p className="mt-3 font-display text-sm font-bold text-ink">{r.title}</p>
                      <p className="mt-1.5 text-sm text-cocoa/70">{r.body}</p>
                      <p className="mt-1.5 text-sm text-cocoa/70">{r.bodyTe}</p>
                    </motion.div>
                  );
                })}
              </div>

              <p className="mt-5 text-xs text-cocoa/50">
                Referral earnings become redeemable as a discount once your balance reaches ₹100 — just ask our staff. No app or card needed, just your mobile number.
              </p>
              <p className="mt-2 text-xs text-cocoa/50">
                మీ బ్యాలెన్స్ ₹100కి చేరుకున్న తర్వాత రిఫరల్ సంపాదన డిస్కౌంట్‌గా వాడుకోవచ్చు — మా సిబ్బందిని అడగండి. యాప్ లేదా కార్డ్ అవసరం లేదు, మీ మొబైల్ నంబర్ మాత్రమే చాలు.
              </p>

              <div className="mt-6 flex items-stretch gap-1 sm:gap-2.5">
                <button
                  onClick={close}
                  className="inline-flex flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright bg-[length:200%_100%] px-0.5 py-3 text-[8px] font-bold uppercase text-ink shadow-[0_10px_25px_rgba(156,107,14,0.3)] transition hover:scale-[1.02] animate-shimmer sm:gap-2 sm:px-6 sm:text-sm sm:tracking-wide"
                >
                  Got It · సరే
                </button>
                <button
                  onClick={() => {
                    close();
                    setLoginOpen(true);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-0.5 whitespace-nowrap rounded-full border border-gold-deep/30 px-0.5 py-3 text-[8px] font-bold uppercase text-gold-deep transition hover:bg-gold/10 sm:gap-1.5 sm:px-6 sm:text-sm sm:tracking-wide"
                >
                  <LogIn size={11} className="shrink-0 sm:hidden" />
                  <LogIn size={15} className="hidden shrink-0 sm:inline" />
                  Login
                </button>
                <a
                  href={WHATSAPP_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-[1.8] items-center justify-center gap-1 whitespace-nowrap rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-1 py-3 text-[8px] font-bold text-[#128C4A] transition hover:bg-[#25D366]/20 sm:flex-1 sm:gap-2 sm:px-6 sm:text-sm"
                >
                  <WhatsAppIcon width={16} height={16} className="hidden shrink-0 sm:inline-flex" />
                  Follow us on WhatsApp · వాట్సాప్‌లో ఫాలో అవ్వండి
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
