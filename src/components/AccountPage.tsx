"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  KeyRound,
  Phone,
  Users,
  Plus,
  Cake,
  HeartHandshake,
  MessageCircle,
  Trash2,
  Loader2,
  LogOut,
  Gift,
  Wallet,
  ShoppingBag,
  Star,
  Pencil,
  Receipt,
} from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";

const SESSION_KEY = "bakasura-account-session";
const LOCKOUT_KEY = "bakasura-account-lockout";
const MIN_REDEMPTION = 100;

type Customer = {
  id: string;
  name: string;
  mobile: string;
  is_admin: boolean;
  dob: string | null;
  anniversary: string | null;
  notes: string | null;
  referred_by: string | null;
  points: number;
  referral_balance: number;
  lifetime_referral_earned: number;
  created_at: string;
  has_pin: boolean;
};

type Session = { mobile: string; pin: string };

type Purchase = {
  id: string;
  created_at: string;
  customer_mobile: string;
  biryani_count: number;
  amount: number;
  referrer_mobile: string | null;
  points_awarded: number;
  referral_bonus: number;
};

type AdminTab = "wishes" | "purchase" | "redeem" | "form" | "customers" | "history";

function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

function displayMobile(mobile: string): string {
  return mobile.length === 12 && mobile.startsWith("91") ? mobile.slice(2) : mobile;
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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function birthdayMessage(name: string) {
  return `Hi ${name}! 🎂 Wishing you a very Happy Birthday from all of us at Bakasura Biryani. Hope your day is as wonderful as you are — come celebrate with a feast on us today!`;
}

function anniversaryMessage(name: string) {
  return `Hi ${name}! 💐 Happy Anniversary from Bakasura Biryani! Wishing you many more years of happiness together. Celebrate today with a biryani feast on us!`;
}

function rupees(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [mobileInput, setMobileInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [purchasesLoadError, setPurchasesLoadError] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  const [activeTab, setActiveTab] = useState<AdminTab>("customers");

  // Add/edit customer form
  const [editingMobile, setEditingMobile] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", mobile: "", pin: "", dob: "", anniversary: "", notes: "", referredBy: "" });
  const [savingForm, setSavingForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Record purchase form
  const [purchase, setPurchase] = useState({ customerMobile: "", biryaniCount: "", amount: "", referredBy: "" });
  const [savingPurchase, setSavingPurchase] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseResult, setPurchaseResult] = useState<{ pointsAwarded: number; referralBonus: number } | null>(null);

  // Redeem form
  const [redeem, setRedeem] = useState({ customerMobile: "", amount: "" });
  const [savingRedeem, setSavingRedeem] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const login = useCallback(async (mobile: string, pin: string) => {
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
        sessionStorage.removeItem(SESSION_KEY);
        setSession(null);
        setCustomer(null);
        return false;
      }
      setCustomer(data.customer);
      setSession({ mobile, pin });
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ mobile, pin }));
      sessionStorage.removeItem(LOCKOUT_KEY);
      return true;
    } catch {
      setAuthError("Network error. Please try again.");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const storedLockout = sessionStorage.getItem(LOCKOUT_KEY);
    if (storedLockout) {
      try {
        const { mobile, until } = JSON.parse(storedLockout);
        if (until > Date.now()) {
          setMobileInput(mobile);
          setLockedUntil(until);
        } else {
          sessionStorage.removeItem(LOCKOUT_KEY);
        }
      } catch {
        sessionStorage.removeItem(LOCKOUT_KEY);
      }
    }

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const { mobile, pin } = JSON.parse(stored) as Session;
        setMobileInput(mobile);
        login(mobile, pin);
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, [login]);

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

  const loadCustomers = useCallback(async (s: Session) => {
    setLoadingCustomers(true);
    setLoadError("");
    try {
      const res = await fetch("/api/account/customers", {
        headers: { "x-account-mobile": s.mobile, "x-account-pin": s.pin },
      });
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error || "Could not load customers.");
        return;
      }
      setCustomers(data.customers || []);
    } catch {
      setLoadError("Network error. Please try again.");
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  useEffect(() => {
    if (session && customer?.is_admin) loadCustomers(session);
  }, [session, customer?.is_admin, loadCustomers]);

  const loadPurchases = useCallback(async (s: Session) => {
    setLoadingPurchases(true);
    setPurchasesLoadError("");
    try {
      const res = await fetch("/api/account/purchases", {
        headers: { "x-account-mobile": s.mobile, "x-account-pin": s.pin },
      });
      const data = await res.json();
      if (!res.ok) {
        setPurchasesLoadError(data.error || "Could not load purchase history.");
        return;
      }
      setPurchases(data.purchases || []);
    } catch {
      setPurchasesLoadError("Network error. Please try again.");
    } finally {
      setLoadingPurchases(false);
    }
  }, []);

  useEffect(() => {
    if (session && customer) loadPurchases(session);
  }, [session, customer, loadPurchases]);

  async function handleDeletePurchase(id: string) {
    if (!session) return;
    if (!confirm("Delete this purchase? Any points or referral bonus it granted will be reversed.")) return;
    try {
      await fetch(`/api/account/purchases?id=${id}`, {
        method: "DELETE",
        headers: { "x-account-mobile": session.mobile, "x-account-pin": session.pin },
      });
      loadPurchases(session);
      loadCustomers(session);
    } catch {
      // no-op — list will just still show the entry, admin can retry
    }
  }

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!mobileInput.trim() || !pinInput.trim() || (lockedUntil && nowTick < lockedUntil)) return;
    login(normalizeMobile(mobileInput), pinInput.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setCustomer(null);
    setMobileInput("");
    setPinInput("");
    setCustomers([]);
  }

  async function handleSaveCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSavingForm(true);
    setFormError("");
    setFormSuccess(false);
    try {
      const res = await fetch("/api/account/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-account-mobile": session.mobile, "x-account-pin": session.pin },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Could not save customer.");
        return;
      }
      setForm({ name: "", mobile: "", pin: "", dob: "", anniversary: "", notes: "", referredBy: "" });
      setEditingMobile(null);
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 2500);
      loadCustomers(session);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSavingForm(false);
    }
  }

  function handleEditCustomer(c: Customer) {
    setEditingMobile(c.mobile);
    setForm({
      name: c.name,
      mobile: displayMobile(c.mobile),
      pin: "",
      dob: c.dob || "",
      anniversary: c.anniversary || "",
      notes: c.notes || "",
      referredBy: c.referred_by || "",
    });
    setFormError("");
    setFormSuccess(false);
    setActiveTab("form");
  }

  async function handleDeleteCustomer(id: string) {
    if (!session) return;
    if (!confirm("Delete this customer?")) return;
    try {
      await fetch(`/api/account/customers?id=${id}`, {
        method: "DELETE",
        headers: { "x-account-mobile": session.mobile, "x-account-pin": session.pin },
      });
      loadCustomers(session);
    } catch {
      // no-op — list will just still show the entry, admin can retry
    }
  }

  async function handleRecordPurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSavingPurchase(true);
    setPurchaseError("");
    setPurchaseResult(null);
    try {
      const res = await fetch("/api/account/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-account-mobile": session.mobile, "x-account-pin": session.pin },
        body: JSON.stringify({
          customerMobile: purchase.customerMobile,
          biryaniCount: Number(purchase.biryaniCount),
          amount: Number(purchase.amount),
          referredBy: purchase.referredBy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPurchaseError(data.error || "Could not record purchase.");
        return;
      }
      setPurchaseResult({ pointsAwarded: data.pointsAwarded, referralBonus: data.referralBonus });
      setPurchase({ customerMobile: "", biryaniCount: "", amount: "", referredBy: "" });
      loadCustomers(session);
      loadPurchases(session);
    } catch {
      setPurchaseError("Network error. Please try again.");
    } finally {
      setSavingPurchase(false);
    }
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSavingRedeem(true);
    setRedeemError("");
    setRedeemSuccess(false);
    try {
      const res = await fetch("/api/account/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-account-mobile": session.mobile, "x-account-pin": session.pin },
        body: JSON.stringify({ customerMobile: redeem.customerMobile, amount: Number(redeem.amount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemError(data.error || "Could not record redemption.");
        return;
      }
      setRedeemSuccess(true);
      setTimeout(() => setRedeemSuccess(false), 2500);
      setRedeem({ customerMobile: "", amount: "" });
      loadCustomers(session);
    } catch {
      setRedeemError("Network error. Please try again.");
    } finally {
      setSavingRedeem(false);
    }
  }

  const todaysBirthdays = customers.filter((c) => isTodayMonthDay(c.dob));
  const todaysAnniversaries = customers.filter((c) => isTodayMonthDay(c.anniversary));

  const historySearchDigits = historySearch.replace(/\D/g, "");
  const filteredPurchases = historySearchDigits
    ? purchases.filter((p) => p.customer_mobile.includes(historySearchDigits))
    : purchases;

  // -------- Login gate --------
  if (!session || !customer) {
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
      </main>
    );
  }

  // -------- Customer dashboard --------
  if (!customer.is_admin) {
    const redeemable = customer.referral_balance >= MIN_REDEMPTION;
    return (
      <main className="relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-28">
        <Navbar showLinks={false} />
        <AnimatedBackground />
        <div className="relative z-10 mx-auto max-w-lg">
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
              MY ACCOUNT
            </div>
            <h1 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
              Hi, <span className="text-gold-gradient">{customer.name}</span>
            </h1>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card-glass rounded-3xl px-6 py-6 text-center">
              <Star size={20} className="mx-auto text-gold-deep" />
              <p className="mt-2 font-display text-2xl font-bold text-ink">{customer.points}</p>
              <p className="text-xs uppercase tracking-wide text-cocoa/60">Loyalty Points</p>
            </div>
            <div className="card-glass rounded-3xl px-6 py-6 text-center">
              <Wallet size={20} className="mx-auto text-gold-deep" />
              <p className="mt-2 font-display text-2xl font-bold text-ink">{rupees(customer.referral_balance)}</p>
              <p className="text-xs uppercase tracking-wide text-cocoa/60">Referral Balance</p>
            </div>
          </div>

          <div className="card-glass mt-6 rounded-3xl px-6 py-6 text-left sm:px-8">
            <p className="font-display text-base font-bold text-ink">Your Referral Number</p>
            <p className="mt-1 text-sm text-cocoa/70">
              Share your mobile number <span className="font-semibold text-ink">{displayMobile(customer.mobile)}</span> with friends —
              when they order and mention it, you earn 10% of their bill every time they order.
            </p>
            <p className="mt-3 text-sm text-cocoa/70">
              {redeemable ? (
                <span className="font-semibold text-emerald">Your balance is redeemable — ask staff to apply it as a discount on your next order.</span>
              ) : (
                <>Balance becomes redeemable once it reaches {rupees(MIN_REDEMPTION)}.</>
              )}
            </p>
            <p className="mt-3 text-xs text-cocoa/50">
              Lifetime referral earnings: {rupees(customer.lifetime_referral_earned)}
            </p>
          </div>

          <div className="card-glass mt-6 rounded-3xl px-6 py-6 text-left sm:px-8">
            <div className="flex items-center gap-2">
              <Receipt size={17} className="text-gold-deep" />
              <p className="font-display text-base font-bold text-ink">Your Purchase History</p>
            </div>
            {loadingPurchases ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-cocoa/60">
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </p>
            ) : purchasesLoadError ? (
              <p className="mt-4 text-sm text-maroon-bright">{purchasesLoadError}</p>
            ) : purchases.length === 0 ? (
              <p className="mt-4 text-sm text-cocoa/60">No purchases recorded yet.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-2.5">
                {purchases.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold-deep/20 bg-white/40 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-ink">
                        {p.biryani_count} biryani{p.biryani_count === 1 ? "" : "s"} · {rupees(p.amount)}
                      </p>
                      <p className="text-xs text-cocoa/50">{formatDateTime(p.created_at)}</p>
                    </div>
                    <span className="text-xs font-semibold text-gold-deep">+{p.points_awarded} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // -------- Admin dashboard --------
  return (
    <main className="relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-28">
      <Navbar showLinks={false} />
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
            Customers, <span className="text-gold-gradient">Points & Referrals</span>
          </h1>
        </div>

        {/* Tab menu */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {([
            { key: "customers", label: "All Customers", icon: Users },
            { key: "wishes", label: "Today's Wishes", icon: Cake },
            { key: "purchase", label: "Record Purchase", icon: ShoppingBag },
            { key: "history", label: "Purchase History", icon: Receipt },
            { key: "redeem", label: "Redeem", icon: Gift },
            { key: "form", label: editingMobile ? "Edit Customer" : "Add Customer", icon: editingMobile ? Pencil : Plus },
          ] as { key: AdminTab; label: string; icon: typeof Users }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                activeTab === key
                  ? "bg-gradient-to-r from-gold-deep via-gold to-gold-bright text-ink"
                  : "border border-gold-deep/25 text-cocoa/70 hover:border-gold-deep/50"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Today's wishes */}
        {activeTab === "wishes" && (
          <div className="card-glass mt-6 rounded-3xl px-6 py-6 sm:px-8">
            <p className="font-display text-base font-bold text-ink">Today&apos;s Wishes</p>
            {todaysBirthdays.length === 0 && todaysAnniversaries.length === 0 && (
              <p className="mt-4 text-sm text-cocoa/60">No birthdays or anniversaries today.</p>
            )}
            <div className="mt-4 flex flex-col gap-3">
              {todaysBirthdays.map((c) => (
                <div key={`b-${c.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-deep/20 bg-white/40 px-4 py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <Cake size={16} className="shrink-0 text-terracotta" />
                    <span className="text-sm font-semibold text-ink">{c.name}</span>
                    <span className="text-xs text-cocoa/60">Birthday</span>
                  </div>
                  <a
                    href={`https://wa.me/${normalizeMobile(c.mobile)}?text=${encodeURIComponent(birthdayMessage(c.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink transition hover:scale-105"
                  >
                    <MessageCircle size={13} />
                    Send Wish
                  </a>
                </div>
              ))}
              {todaysAnniversaries.map((c) => (
                <div key={`a-${c.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-deep/20 bg-white/40 px-4 py-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <HeartHandshake size={16} className="shrink-0 text-maroon-bright" />
                    <span className="text-sm font-semibold text-ink">{c.name}</span>
                    <span className="text-xs text-cocoa/60">Anniversary</span>
                  </div>
                  <a
                    href={`https://wa.me/${normalizeMobile(c.mobile)}?text=${encodeURIComponent(anniversaryMessage(c.name))}`}
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

        {/* Record a purchase */}
        {activeTab === "purchase" && (
        <form
          onSubmit={handleRecordPurchase}
          className="card-glass mt-6 grid grid-cols-1 gap-4 rounded-3xl px-6 py-7 text-left sm:grid-cols-3 sm:px-8"
        >
          <div className="sm:col-span-3 flex items-center gap-2">
            <ShoppingBag size={17} className="text-gold-deep" />
            <p className="font-display text-base font-bold text-ink">Record a Purchase</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Customer Mobile</label>
            <input
              type="tel"
              required
              value={purchase.customerMobile}
              onChange={(e) => setPurchase((p) => ({ ...p, customerMobile: e.target.value }))}
              placeholder="10-digit mobile — added automatically if new"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Biryanis Bought</label>
            <input
              type="number"
              min="1"
              required
              value={purchase.biryaniCount}
              onChange={(e) => setPurchase((p) => ({ ...p, biryaniCount: e.target.value }))}
              placeholder="e.g. 2"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Bill Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={purchase.amount}
              onChange={(e) => setPurchase((p) => ({ ...p, amount: e.target.value }))}
              placeholder="e.g. 450"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Referred By (mobile, optional)</label>
            <input
              type="tel"
              value={purchase.referredBy}
              onChange={(e) => setPurchase((p) => ({ ...p, referredBy: e.target.value }))}
              placeholder="Referrer's mobile number — added automatically if new"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
            <p className="text-xs text-cocoa/50">Leave blank to keep this customer&apos;s existing referrer, if any.</p>
          </div>

          {purchaseError && <p className="text-sm text-maroon-bright sm:col-span-3">{purchaseError}</p>}
          {purchaseResult && (
            <p className="text-sm text-emerald sm:col-span-3">
              Recorded! +{purchaseResult.pointsAwarded} points
              {purchaseResult.referralBonus > 0 && ` · ${rupees(purchaseResult.referralBonus)} credited to their referrer`}
            </p>
          )}

          <button
            type="submit"
            disabled={savingPurchase}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-3 sm:w-fit"
          >
            {savingPurchase ? <Loader2 size={15} className="animate-spin" /> : <ShoppingBag size={15} />}
            {savingPurchase ? "Saving..." : "Record Purchase"}
          </button>
        </form>
        )}

        {/* Purchase history */}
        {activeTab === "history" && (
        <div className="card-glass mt-6 rounded-3xl px-6 py-7 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt size={17} className="text-gold-deep" />
              <p className="font-display text-base font-bold text-ink">
                Purchase History {filteredPurchases.length > 0 && `(${filteredPurchases.length})`}
              </p>
            </div>
            <div className="relative w-full sm:w-56">
              <Phone size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-deep/50" />
              <input
                type="tel"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search by mobile number"
                className="w-full rounded-xl border border-gold-deep/25 bg-white/50 py-2 pl-9 pr-3 text-sm text-ink outline-none transition focus:border-gold-deep"
              />
            </div>
          </div>

          {loadingPurchases ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-cocoa/60">
              <Loader2 size={14} className="animate-spin" />
              Loading...
            </p>
          ) : purchasesLoadError ? (
            <p className="mt-4 text-sm text-maroon-bright">{purchasesLoadError}</p>
          ) : purchases.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa/60">No purchases recorded yet.</p>
          ) : filteredPurchases.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa/60">No purchases match that mobile number.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gold-deep/15 text-xs uppercase tracking-wide text-cocoa/50">
                    <th className="pb-2 pr-4 font-semibold">Date</th>
                    <th className="pb-2 pr-4 font-semibold">Customer</th>
                    <th className="pb-2 pr-4 font-semibold">Biryanis</th>
                    <th className="pb-2 pr-4 font-semibold">Amount</th>
                    <th className="pb-2 pr-4 font-semibold">Points</th>
                    <th className="pb-2 pr-4 font-semibold">Referral Bonus</th>
                    <th className="pb-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((p) => {
                    const buyer = customers.find((c) => c.mobile === p.customer_mobile);
                    const referrer = p.referrer_mobile ? customers.find((c) => c.mobile === p.referrer_mobile) : null;
                    return (
                      <tr key={p.id} className="border-b border-gold-deep/10 text-cocoa/80">
                        <td className="py-2.5 pr-4 text-xs text-cocoa/60">{formatDateTime(p.created_at)}</td>
                        <td className="py-2.5 pr-4 font-medium text-ink">{buyer?.name || displayMobile(p.customer_mobile)}</td>
                        <td className="py-2.5 pr-4">{p.biryani_count}</td>
                        <td className="py-2.5 pr-4">{rupees(p.amount)}</td>
                        <td className="py-2.5 pr-4">+{p.points_awarded}</td>
                        <td className="py-2.5 pr-4 text-cocoa/60">
                          {p.referral_bonus > 0 ? `${rupees(p.referral_bonus)} → ${referrer?.name || displayMobile(p.referrer_mobile!)}` : "—"}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleDeletePurchase(p.id)}
                            aria-label="Delete purchase"
                            className="text-cocoa/40 transition hover:text-maroon-bright"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Redeem referral balance */}
        {activeTab === "redeem" && (
        <form
          onSubmit={handleRedeem}
          className="card-glass mt-6 grid grid-cols-1 gap-4 rounded-3xl px-6 py-7 text-left sm:grid-cols-3 sm:px-8"
        >
          <div className="sm:col-span-3 flex items-center gap-2">
            <Gift size={17} className="text-gold-deep" />
            <p className="font-display text-base font-bold text-ink">Redeem Referral Balance</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Referrer Mobile</label>
            <input
              type="tel"
              required
              value={redeem.customerMobile}
              onChange={(e) => setRedeem((r) => ({ ...r, customerMobile: e.target.value }))}
              placeholder="10-digit mobile"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Discount Amount (₹)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={redeem.amount}
              onChange={(e) => setRedeem((r) => ({ ...r, amount: e.target.value }))}
              placeholder="e.g. 100"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          {redeemError && <p className="text-sm text-maroon-bright sm:col-span-3">{redeemError}</p>}
          {redeemSuccess && <p className="text-sm text-emerald sm:col-span-3">Redemption recorded!</p>}
          <p className="text-xs text-cocoa/50 sm:col-span-3">Only allowed once a referrer&apos;s balance reaches {rupees(MIN_REDEMPTION)}.</p>

          <button
            type="submit"
            disabled={savingRedeem}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-3 sm:w-fit"
          >
            {savingRedeem ? <Loader2 size={15} className="animate-spin" /> : <Gift size={15} />}
            {savingRedeem ? "Saving..." : "Record Redemption"}
          </button>
        </form>
        )}

        {/* Add/update customer */}
        {activeTab === "form" && (
        <form
          onSubmit={handleSaveCustomer}
          className="card-glass mt-6 grid grid-cols-1 gap-4 rounded-3xl px-6 py-7 text-left sm:grid-cols-2 sm:px-8"
        >
          <div className="sm:col-span-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {editingMobile ? <Pencil size={17} className="text-gold-deep" /> : <Plus size={17} className="text-gold-deep" />}
              <p className="font-display text-base font-bold text-ink">
                {editingMobile ? `Editing ${form.name || editingMobile}` : "Add a Customer"}
              </p>
            </div>
            {editingMobile && (
              <button
                type="button"
                onClick={() => {
                  setEditingMobile(null);
                  setForm({ name: "", mobile: "", pin: "", dob: "", anniversary: "", notes: "", referredBy: "" });
                  setFormError("");
                }}
                className="text-xs font-semibold text-cocoa/60 underline-offset-2 hover:underline"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Customer name"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Mobile Number</label>
            <input
              type="tel"
              required
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
              placeholder="10-digit mobile"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">PIN (4-8 digits, optional)</label>
            <input
              type="text"
              value={form.pin}
              onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))}
              placeholder="Leave blank to keep existing"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Referred By (mobile, optional)</label>
            <input
              type="tel"
              value={form.referredBy}
              onChange={(e) => setForm((f) => ({ ...f, referredBy: e.target.value }))}
              placeholder="Referrer's mobile number"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Anniversary</label>
            <input
              type="date"
              value={form.anniversary}
              onChange={(e) => setForm((f) => ({ ...f, anniversary: e.target.value }))}
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">Notes (optional)</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. regular customer, prefers mutton"
              className="rounded-xl border border-gold-deep/25 bg-white/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold-deep"
            />
          </div>

          {editingMobile && (
            <p className="text-xs text-cocoa/50 sm:col-span-2">Leave PIN blank to keep the existing one.</p>
          )}
          {formError && <p className="text-sm text-maroon-bright sm:col-span-2">{formError}</p>}
          {formSuccess && <p className="text-sm text-emerald sm:col-span-2">Saved!</p>}

          <button
            type="submit"
            disabled={savingForm}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:w-fit"
          >
            {savingForm ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {savingForm ? "Saving..." : editingMobile ? "Save Changes" : "Save Customer"}
          </button>
        </form>
        )}

        {/* All customers */}
        {activeTab === "customers" && (
        <div className="card-glass mt-6 rounded-3xl px-6 py-7 sm:px-8">
          <div className="flex items-center gap-2">
            <Users size={17} className="text-gold-deep" />
            <p className="font-display text-base font-bold text-ink">
              All Customers {customers.length > 0 && `(${customers.length})`}
            </p>
          </div>

          {loadingCustomers ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-cocoa/60">
              <Loader2 size={14} className="animate-spin" />
              Loading...
            </p>
          ) : loadError ? (
            <p className="mt-4 text-sm text-maroon-bright">{loadError}</p>
          ) : customers.length === 0 ? (
            <p className="mt-4 text-sm text-cocoa/60">No customers saved yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gold-deep/15 text-xs uppercase tracking-wide text-cocoa/50">
                    <th className="pb-2 pr-4 font-semibold">Name</th>
                    <th className="pb-2 pr-4 font-semibold">Mobile</th>
                    <th className="pb-2 pr-4 font-semibold">Points</th>
                    <th className="pb-2 pr-4 font-semibold">Referral Balance</th>
                    <th className="pb-2 pr-4 font-semibold">Referred By</th>
                    <th className="pb-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-gold-deep/10 text-cocoa/80">
                      <td className="py-2.5 pr-4 font-medium text-ink">
                        {c.name}
                        {c.is_admin && <span className="ml-2 text-xs text-gold-deep">(admin)</span>}
                        {!c.has_pin && <span className="ml-2 rounded-full bg-maroon-bright/10 px-2 py-0.5 text-xs font-semibold text-maroon-bright">No PIN</span>}
                      </td>
                      <td className="py-2.5 pr-4">{displayMobile(c.mobile)}</td>
                      <td className="py-2.5 pr-4">{c.points}</td>
                      <td className="py-2.5 pr-4">
                        {rupees(c.referral_balance)}
                        {c.referral_balance >= MIN_REDEMPTION && (
                          <span className="ml-2 rounded-full bg-emerald/10 px-2 py-0.5 text-xs font-semibold text-emerald">Redeemable</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-cocoa/60">{c.referred_by ? displayMobile(c.referred_by) : "—"}</td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleEditCustomer(c)}
                            aria-label="Edit"
                            className="text-cocoa/40 transition hover:text-gold-deep"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c.id)}
                            aria-label="Delete"
                            className="text-cocoa/40 transition hover:text-maroon-bright"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>
    </main>
  );
}
