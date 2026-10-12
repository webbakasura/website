"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, KeyRound, Phone, Loader2, X } from "lucide-react";

const SESSION_KEY = "bakasura-account-session";
const LOCKOUT_KEY = "bakasura-account-lockout";

function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [mobileInput, setMobileInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  // Re-sync with any existing lockout (and clear stale fields) each time the
  // modal is opened, since it stays mounted between opens.
  useEffect(() => {
    if (!open) return;
    setPinInput("");
    setAuthError("");
    const storedLockout = sessionStorage.getItem(LOCKOUT_KEY);
    if (storedLockout) {
      try {
        const { mobile, until } = JSON.parse(storedLockout);
        if (until > Date.now()) {
          setMobileInput(mobile);
          setLockedUntil(until);
          return;
        }
        sessionStorage.removeItem(LOCKOUT_KEY);
      } catch {
        sessionStorage.removeItem(LOCKOUT_KEY);
      }
    }
    setLockedUntil(null);
  }, [open]);

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

  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  useEffect(() => {
    if (lockedUntil && nowTick >= lockedUntil) {
      setLockedUntil(null);
      setAuthError("");
      sessionStorage.removeItem(LOCKOUT_KEY);
    }
  }, [lockedUntil, nowTick]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mobile = normalizeMobile(mobileInput);
    const pin = pinInput.trim();
    if (!mobile || !pin || (lockedUntil && nowTick < lockedUntil)) return;

    setChecking(true);
    setAuthError("");
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "x-account-mobile": mobile, "x-account-pin": pin },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setAuthError(data.error || "Too many attempts.");
          const until = Date.now() + (data.retryAfterSeconds || 300) * 1000;
          setLockedUntil(until);
          sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ mobile, until }));
        } else {
          setAuthError(data.error || "Incorrect mobile number or PIN.");
        }
        return;
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ mobile, pin }));
      sessionStorage.removeItem(LOCKOUT_KEY);
      onClose();
      router.push("/account");
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  const isLocked = !!lockedUntil && nowTick < lockedUntil;
  const remainingMs = isLocked ? lockedUntil! - nowTick : 0;
  const remainingLabel = isLocked
    ? `${Math.floor(remainingMs / 60000)}:${String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0")}`
    : "";

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
            className="relative flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl border border-gold-deep/20 bg-paper px-7 py-9 text-center shadow-2xl"
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

            <span className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 ${isLocked ? "bg-maroon-bright/10 ring-maroon-bright/25" : "bg-gold/10 ring-gold-deep/25"}`}>
              <Lock size={20} className={isLocked ? "text-maroon-bright" : "text-gold-deep"} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink">My Account</p>
              <p className="mt-1 text-sm text-cocoa/70">
                {isLocked ? "Too many wrong attempts." : "Log in with your mobile number and PIN."}
              </p>
            </div>
            <div className="relative w-full">
              <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
              <input
                type="tel"
                autoComplete="off"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                placeholder="Mobile number"
                autoFocus
                disabled={isLocked}
                className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-gold-deep disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <div className="relative w-full">
              <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
              <input
                type="password"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN"
                disabled={isLocked}
                className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2.5 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-gold-deep disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            {isLocked ? (
              <p className="text-sm font-semibold text-maroon-bright">
                Try again in <span className="font-mono tabular-nums">{remainingLabel}</span>
              </p>
            ) : (
              authError && <p className="text-xs text-maroon-bright">{authError}</p>
            )}
            <button
              type="submit"
              disabled={checking || isLocked}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
              {isLocked ? "Locked" : "Log In"}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
