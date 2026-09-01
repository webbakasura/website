"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  KeyRound,
  Users,
  Plus,
  Cake,
  HeartHandshake,
  MessageCircle,
  Trash2,
  Loader2,
  LogOut,
} from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";

const STORAGE_KEY = "bakasura-admin-passcode";

type Entry = {
  id: string;
  name: string;
  mobile: string;
  dob: string | null;
  anniversary: string | null;
  notes: string | null;
  created_at: string;
};

function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

function isTodayMonthDay(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function birthdayMessage(name: string) {
  return `Hi ${name}! 🎂 Wishing you a very Happy Birthday from all of us at Bakasura Biryani. Hope your day is as wonderful as you are — come celebrate with a feast on us today!`;
}

function anniversaryMessage(name: string) {
  return `Hi ${name}! 💐 Happy Anniversary from Bakasura Biryani! Wishing you many more years of happiness together. Celebrate today with a biryani feast on us!`;
}

export default function AdminCustomers() {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPasscode(stored);
      return;
    }
    // No stored session — ask the server whether we're currently locked
    // out, so a page refresh mid-lockout still shows the countdown
    // instead of a blank passcode form (the lockout is enforced
    // server-side and survives regardless; this just restores the UI).
    (async () => {
      try {
        const res = await fetch("/api/admin/customer-dates", {
          headers: { "x-admin-passcode": "" },
        });
        if (res.status === 429) {
          const data = await res.json();
          setAuthError(data.error || "Too many attempts.");
          setLockedUntil(Date.now() + (data.retryAfterSeconds || 300) * 1000);
        }
      } catch {
        // ignore — worst case, the gate just shows normally and the
        // server will still reject an attempt if actually locked
      }
    })();
  }, []);

  // Tick every second while locked out, to drive the countdown display.
  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  useEffect(() => {
    if (lockedUntil && nowTick >= lockedUntil) {
      setLockedUntil(null);
      setAuthError("");
    }
  }, [lockedUntil, nowTick]);

  const loadEntries = useCallback(async (code: string) => {
    setLoadingEntries(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/customer-dates", {
        headers: { "x-admin-passcode": code },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setAuthError(data.error || "Too many attempts.");
          setLockedUntil(Date.now() + (data.retryAfterSeconds || 300) * 1000);
          setPasscode(null);
          sessionStorage.removeItem(STORAGE_KEY);
        } else if (res.status === 401) {
          setAuthError(data.error || "Incorrect passcode.");
          setPasscode(null);
          sessionStorage.removeItem(STORAGE_KEY);
        } else {
          setLoadError(data.error || "Could not load entries.");
        }
        return;
      }
      setEntries(data.entries || []);
    } catch {
      setLoadError("Network error. Please try again.");
    } finally {
      setLoadingEntries(false);
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (passcode) loadEntries(passcode);
  }, [passcode, loadEntries]);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passcodeInput.trim() || (lockedUntil && nowTick < lockedUntil)) return;
    setChecking(true);
    setAuthError("");
    sessionStorage.setItem(STORAGE_KEY, passcodeInput.trim());
    setPasscode(passcodeInput.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setPasscode(null);
    setPasscodeInput("");
    setEntries([]);
    setLoadError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode || !name.trim() || !mobile.trim() || (!dob && !anniversary)) return;

    setSaving(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const res = await fetch("/api/admin/customer-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
        body: JSON.stringify({ name, mobile, dob: dob || null, anniversary: anniversary || null, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Could not save entry.");
        return;
      }
      setName("");
      setMobile("");
      setDob("");
      setAnniversary("");
      setNotes("");
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 2500);
      loadEntries(passcode);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!passcode) return;
    if (!confirm("Delete this entry?")) return;
    try {
      await fetch(`/api/admin/customer-dates?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-passcode": passcode },
      });
      loadEntries(passcode);
    } catch {
      // no-op — list will just still show the entry, user can retry
    }
  }

  const todaysBirthdays = entries.filter((e) => isTodayMonthDay(e.dob));
  const todaysAnniversaries = entries.filter((e) => isTodayMonthDay(e.anniversary));

  // -------- Passcode gate --------
  if (!passcode) {
    const isLocked = !!lockedUntil && nowTick < lockedUntil;
    const remainingMs = isLocked ? lockedUntil! - nowTick : 0;
    const remainingLabel = isLocked
      ? `${Math.floor(remainingMs / 60000)}:${String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0")}`
      : "";

    return (
      <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 text-center">
        <Navbar />
        <AnimatedBackground />
        <motion.form
          onSubmit={handleUnlock}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="card-glass relative z-10 flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl px-7 py-9"
        >
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 ${isLocked ? "bg-maroon-bright/10 ring-maroon-bright/25" : "bg-gold/10 ring-gold-deep/25"}`}>
            <Lock size={20} className={isLocked ? "text-maroon-bright" : "text-gold-deep"} />
          </span>
          <div>
            <p className="font-display text-base font-bold text-ink">Admin Access</p>
            <p className="mt-1 text-sm text-cocoa/70">
              {isLocked ? "Too many wrong attempts." : "Enter the passcode to continue."}
            </p>
          </div>
          <div className="relative w-full">
            <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-deep/50" />
            <input
              type="password"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Passcode"
              autoFocus
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
            {isLocked ? "Locked" : "Unlock"}
          </button>
        </motion.form>
      </main>
    );
  }

  // -------- Main tool --------
  return (
    <main className="relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-28">
      <Navbar />
      <AnimatedBackground />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-deep/25 px-3.5 py-1.5 text-xs font-semibold text-cocoa/70 transition hover:border-maroon-bright/40 hover:text-maroon-bright"
          >
            <LogOut size={13} />
            Log Out
          </button>
        </div>
        <div className="text-center">
          <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
            BAKASURA ADMIN
          </div>
          <h1 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
            Customer <span className="text-gold-gradient">Wishes</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-cocoa/70">
            Save customer birthdays and anniversaries here. Anyone due today
            shows up below with a ready-to-send WhatsApp message.
          </p>
        </div>

        {/* Today's wishes */}
        {(todaysBirthdays.length > 0 || todaysAnniversaries.length > 0) && (
          <div className="card-glass mt-8 rounded-3xl px-6 py-6 sm:px-8">
            <p className="font-display text-base font-bold text-ink">Today&apos;s Wishes</p>
            <div className="mt-4 flex flex-col gap-3">
              {todaysBirthdays.map((e) => (
                <div key={`b-${e.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-deep/20 bg-white/40 px-4 py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Cake size={16} className="shrink-0 text-terracotta" />
                    <span className="text-sm font-semibold text-ink">{e.name}</span>
                    <span className="text-xs text-cocoa/60">Birthday</span>
                  </div>
                  <a
                    href={`https://wa.me/${normalizeMobile(e.mobile)}?text=${encodeURIComponent(birthdayMessage(e.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition hover:scale-105"
                  >
                    <MessageCircle size={13} />
                    Send Wish
                  </a>
                </div>
              ))}
              {todaysAnniversaries.map((e) => (
                <div key={`a-${e.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-deep/20 bg-white/40 px-4 py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <HeartHandshake size={16} className="shrink-0 text-maroon-bright" />
                    <span className="text-sm font-semibold text-ink">{e.name}</span>
                    <span className="text-xs text-cocoa/60">Anniversary</span>
                  </div>
                  <a
                    href={`https://wa.me/${normalizeMobile(e.mobile)}?text=${encodeURIComponent(anniversaryMessage(e.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition hover:scale-105"
                  >
                    <MessageCircle size={13} />
                    Send Wish
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add entry form */}
        <form
          onSubmit={handleSave}
          className="card-glass mt-6 grid grid-cols-1 gap-4 rounded-3xl px-6 py-7 text-left sm:grid-cols-2 sm:px-8"
        >
          <div className="sm:col-span-2 flex items-center gap-2">
            <Plus size={17} className="text-gold-deep" />
            <p className="font-display text-base font-bold text-ink">Add a Customer</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Mobile Number</label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Anniversary</label>
            <input
              type="date"
              value={anniversary}
              onChange={(e) => setAnniversary(e.target.value)}
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. regular customer, prefers mutton"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          {formError && <p className="text-sm text-maroon-bright sm:col-span-2">{formError}</p>}
          {formSuccess && <p className="text-sm text-emerald sm:col-span-2">Saved!</p>}
          {!dob && !anniversary && !formError && (
            <p className="text-xs text-cocoa/50 sm:col-span-2">Enter at least a birthday or an anniversary date.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:w-fit"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {saving ? "Saving..." : "Save Customer"}
          </button>
        </form>

        {/* All entries */}
        <div className="card-glass mt-6 rounded-3xl px-6 py-7 sm:px-8">
          <div className="flex items-center gap-2">
            <Users size={17} className="text-gold-deep" />
            <p className="font-display text-base font-bold text-ink">
              All Saved Customers {entries.length > 0 && `(${entries.length})`}
            </p>
          </div>

          {loadingEntries ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-cocoa/60">
              <Loader2 size={14} className="animate-spin" />
              Loading...
            </p>
          ) : loadError ? (
            <p className="mt-4 text-sm text-maroon-bright">{loadError}</p>
          ) : entries.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa/60">No customers saved yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gold-deep/15 text-xs uppercase tracking-wide text-cocoa/50">
                    <th className="pb-2 pr-4 font-semibold">Name</th>
                    <th className="pb-2 pr-4 font-semibold">Mobile</th>
                    <th className="pb-2 pr-4 font-semibold">Birthday</th>
                    <th className="pb-2 pr-4 font-semibold">Anniversary</th>
                    <th className="pb-2 pr-4 font-semibold">Notes</th>
                    <th className="pb-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} className="border-b border-gold-deep/10 text-cocoa/80">
                      <td className="py-2.5 pr-4 font-medium text-ink">{e.name}</td>
                      <td className="py-2.5 pr-4">{e.mobile}</td>
                      <td className="py-2.5 pr-4">{formatDate(e.dob)}</td>
                      <td className="py-2.5 pr-4">{formatDate(e.anniversary)}</td>
                      <td className="py-2.5 pr-4 text-cocoa/60">{e.notes || "—"}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDelete(e.id)}
                          aria-label="Delete"
                          className="text-cocoa/40 transition hover:text-maroon-bright"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
