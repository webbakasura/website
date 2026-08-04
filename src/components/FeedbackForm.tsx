"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  Utensils,
  Heart,
} from "lucide-react";

import RatingSelect, { RatingValue } from "./RatingSelect";

type Status = "idle" | "submitting" | "success" | "error";

const RATING_FIELDS = [
  { key: "qualityRating", label: "Quality of Food" },
  { key: "quantityRating", label: "Quantity of Food" },
  { key: "tasteRating", label: "Taste" },
  { key: "temperatureRating", label: "Temperature" },
  { key: "speedRating", label: "Speed of Service" },
  { key: "overallRating", label: "Overall Experience", featured: true },
] as const;

type RatingKey = (typeof RATING_FIELDS)[number]["key"];

type Ratings = Record<RatingKey, RatingValue | null>;

const EMPTY_RATINGS: Ratings = {
  qualityRating: null,
  quantityRating: null,
  tasteRating: null,
  temperatureRating: null,
  speedRating: null,
  overallRating: null,
};

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const [ratings, setRatings] =
      useState<Ratings>(EMPTY_RATINGS);

  const [website, setWebsite] = useState("");

  const [status, setStatus] =
      useState<Status>("idle");

  const [errorMsg, setErrorMsg] = useState("");

  const ratedCount = RATING_FIELDS.filter(
      (field) => ratings[field.key] !== null
  ).length;

  const ratingsComplete =
      ratedCount === RATING_FIELDS.length;

  const progress =
      (ratedCount / RATING_FIELDS.length) * 100;

  function setRating(
      key: RatingKey,
      value: RatingValue
  ) {
    setRatings((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit(
      e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim() || !ratingsComplete) {
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          contact,
          message,
          ...ratings,
          website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");

        setErrorMsg(
            data.error ||
            "Something went wrong. Please try again."
        );

        return;
      }

      setStatus("success");

      setName("");
      setContact("");
      setMessage("");
      setRatings(EMPTY_RATINGS);
    } catch {
      setStatus("error");

      setErrorMsg(
          "Network error. Please try again."
      );
    }
  }

  /* =========================================
     SUCCESS
  ========================================= */

  if (status === "success") {
    return (
        <motion.div
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="
          relative
          mx-auto
          max-w-lg
          overflow-hidden
          rounded-[32px]
          border
          border-gold-deep/10
          bg-gradient-to-br
          from-white/95
          via-white/90
          to-[#fff8e9]/90
          px-7
          py-12
          text-center
          shadow-[0_24px_70px_rgba(92,57,16,0.10)]
          backdrop-blur-xl
          sm:px-10
        "
        >
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-emerald/10 blur-3xl" />

          {/* Sparkles */}

          {[...Array(6)].map((_, i) => (
              <motion.span
                  key={i}
                  className="pointer-events-none absolute"
                  style={{
                    left: `${10 + i * 16}%`,
                    top: "8%",
                  }}
                  initial={{
                    opacity: 0,
                    y: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: 90,
                    rotate: 180,
                  }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
              >
                <Sparkles
                    size={14}
                    className={
                      i % 2 === 0
                          ? "text-gold-deep"
                          : "text-emerald"
                    }
                />
              </motion.span>
          ))}

          <div className="relative z-10 flex flex-col items-center">

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 180,
                }}
                className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-emerald/10
              ring-1
              ring-emerald/25
            "
            >
              <CheckCircle2
                  size={38}
                  className="text-emerald"
              />
            </motion.div>

            <p className="mt-6 font-display text-2xl font-bold text-ink">
              Thank You!
            </p>

            <p className="mt-3 max-w-sm text-sm leading-6 text-cocoa/65">
              Your review has reached our kitchen.
              Thank you for taking the time to share
              your experience with us.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-gold-deep">
              <Heart size={14} />
              Made with love, served with gratitude
            </div>

            <button
                type="button"
                onClick={() => setStatus("idle")}
                className="
              mt-8
              rounded-full
              border
              border-gold-deep/20
              bg-white/70
              px-6
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-gold-deep
              transition
              hover:border-gold-deep/40
              hover:bg-gold/10
            "
            >
              Share Another Review
            </button>

          </div>
        </motion.div>
    );
  }

  /* =========================================
     FORM
  ========================================= */

  return (
      <form
          onSubmit={handleSubmit}
          className="
        relative
        grid
        w-full
        grid-cols-1
        overflow-hidden
        rounded-[32px]
        border
        border-gold-deep/10
        bg-gradient-to-br
        from-white/90
        via-white/80
        to-[#fff9ed]/80
        shadow-[0_25px_70px_rgba(92,57,16,0.08)]
        backdrop-blur-xl
        lg:grid-cols-[1.08fr_0.92fr]
      "
      >

        {/* Decorative glows */}

        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-emerald/5 blur-3xl" />

        {/* Honeypot */}

        <input
            type="text"
            value={website}
            onChange={(e) =>
                setWebsite(e.target.value)
            }
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
        />

        {/* =====================================
          LEFT SIDE — RATINGS
      ====================================== */}

        <div className="relative z-10 p-6 sm:p-8 lg:p-10">

          {/* Heading */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="mb-3 flex items-center gap-2 text-gold-deep">
                <Utensils size={15} />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                Your Experience
              </span>
              </div>

              <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                How Was Your Biryani?
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-cocoa/60">
                Tell us how we did. Your feedback
                helps us make every plate better.
              </p>

            </div>

            {/* Counter */}

            <div
                className="
              flex
              h-11
              min-w-[54px]
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-gold-deep/15
              bg-white/70
              px-3
              text-xs
              font-bold
              text-gold-deep
              shadow-sm
            "
            >
              {ratedCount}/{RATING_FIELDS.length}
            </div>

          </div>

          {/* Progress */}

          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cocoa/40">
              Rating progress
            </span>

              <span className="text-[10px] font-bold text-gold-deep/70">
              {Math.round(progress)}%
            </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gold-deep/10">

              <motion.div
                  className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-gold-deep
                via-gold
                to-emerald
              "
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                  }}
              />

            </div>

          </div>

          {/* Rating options */}

          <div
              className="
            mt-7
            overflow-hidden
            rounded-2xl
            border
            border-gold-deep/10
            bg-white/45
          "
          >

            {RATING_FIELDS.map(
                (field, index) => (
                    <div
                        key={field.key}
                        className={`
                  px-4
                  py-4
                  sm:px-5

                  ${
                            index !==
                            RATING_FIELDS.length - 1
                                ? "border-b border-gold-deep/10"
                                : ""
                        }

                  ${
                            "featured" in field &&
                            field.featured
                                ? "bg-gold/5"
                                : ""
                        }
                `}
                    >

                      <RatingSelect
                          label={field.label}
                          value={ratings[field.key]}
                          onChange={(value) =>
                              setRating(
                                  field.key,
                                  value
                              )
                          }
                      />

                    </div>
                )
            )}

          </div>

          {/* Rating completion */}

          <AnimatePresence mode="wait">

            {!ratingsComplete ? (
                <motion.p
                    key="remaining"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-xs text-cocoa/45"
                >
                  {RATING_FIELDS.length - ratedCount}{" "}
                  more{" "}
                  {RATING_FIELDS.length - ratedCount === 1
                      ? "category"
                      : "categories"}{" "}
                  to rate.
                </motion.p>
            ) : (
                <motion.div
                    key="complete"
                    initial={{
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald"
                >
                  <CheckCircle2 size={14} />
                  All ratings completed
                </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* =====================================
          RIGHT SIDE — DETAILS
      ====================================== */}

        <div
            className="
          relative
          z-10
          border-t
          border-gold-deep/10
          bg-white/30
          p-6
          sm:p-8
          lg:border-l
          lg:border-t-0
          lg:p-10
        "
        >

          <div className="mb-7">

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-deep">
            Almost Done
          </span>

            <h3 className="mt-2 font-display text-xl font-bold text-ink">
              Tell Us About You
            </h3>

            <p className="mt-2 text-sm leading-6 text-cocoa/60">
              Just your name is required. Contact
              details and comments are optional.
            </p>

          </div>

          <div className="flex flex-col gap-5">

            {/* NAME */}

            <div>

              <label
                  htmlFor="fb-name"
                  className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-cocoa/60"
              >
                Your Name
                <span className="ml-1 text-maroon-bright">
                *
              </span>
              </label>

              <div className="group relative">

                <User
                    size={17}
                    className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gold-deep/40
                  transition
                  group-focus-within:text-gold-deep
                "
                />

                <input
                    id="fb-name"
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Enter your name"
                    className="
                  w-full
                  rounded-xl
                  border
                  border-gold-deep/15
                  bg-white/65
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-ink
                  shadow-sm
                  outline-none
                  transition-all
                  placeholder:text-cocoa/30
                  hover:border-gold-deep/25
                  focus:border-gold-deep/50
                  focus:bg-white/90
                  focus:ring-4
                  focus:ring-gold/5
                "
                />

              </div>

            </div>

            {/* CONTACT */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                    htmlFor="fb-contact"
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-cocoa/60"
                >
                  Phone or Email
                </label>

                <span className="text-[10px] text-cocoa/35">
                Optional
              </span>

              </div>

              <div className="group relative">

                <Phone
                    size={17}
                    className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gold-deep/40
                  transition
                  group-focus-within:text-gold-deep
                "
                />

                <input
                    id="fb-contact"
                    type="text"
                    maxLength={150}
                    value={contact}
                    onChange={(e) =>
                        setContact(e.target.value)
                    }
                    placeholder="So we can reply"
                    className="
                  w-full
                  rounded-xl
                  border
                  border-gold-deep/15
                  bg-white/65
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  text-ink
                  shadow-sm
                  outline-none
                  transition-all
                  placeholder:text-cocoa/30
                  hover:border-gold-deep/25
                  focus:border-gold-deep/50
                  focus:bg-white/90
                  focus:ring-4
                  focus:ring-gold/5
                "
                />

              </div>

            </div>

            {/* COMMENTS */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                    htmlFor="fb-message"
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-cocoa/60"
                >
                  Your Comments
                </label>

                <span className="text-[10px] text-cocoa/35">
                Optional
              </span>

              </div>

              <div className="group relative">

                <MessageSquare
                    size={17}
                    className="
                  pointer-events-none
                  absolute
                  left-4
                  top-4
                  text-gold-deep/40
                  transition
                  group-focus-within:text-gold-deep
                "
                />

                <textarea
                    id="fb-message"
                    maxLength={2000}
                    rows={6}
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    placeholder="What did you love? What can we improve?"
                    className="
                  min-h-[145px]
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gold-deep/15
                  bg-white/65
                  py-3
                  pl-11
                  pr-4
                  text-sm
                  leading-6
                  text-ink
                  shadow-sm
                  outline-none
                  transition-all
                  placeholder:text-cocoa/30
                  hover:border-gold-deep/25
                  focus:border-gold-deep/50
                  focus:bg-white/90
                  focus:ring-4
                  focus:ring-gold/5
                "
                />

                <span className="absolute bottom-3 right-4 text-[10px] text-cocoa/30">
                {message.length}/2000
              </span>

              </div>

            </div>

            {/* ERROR */}

            <AnimatePresence>

              {status === "error" && (
                  <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="
                  rounded-xl
                  border
                  border-maroon-bright/15
                  bg-maroon-bright/5
                  px-4
                  py-3
                  text-sm
                  text-maroon-bright
                "
                  >
                    {errorMsg}
                  </motion.div>
              )}

            </AnimatePresence>

            {/* SUBMIT */}

            <button
                type="submit"
                disabled={
                    status === "submitting" ||
                    !ratingsComplete ||
                    !name.trim()
                }
                className="
              group
              relative
              mt-1
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-full
              bg-gradient-to-r
              from-gold-deep
              via-gold
              to-gold-bright
              px-6
              py-3.5
              text-sm
              font-bold
              uppercase
              tracking-[0.08em]
              text-ink
              shadow-[0_12px_30px_rgba(156,107,14,0.22)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_16px_35px_rgba(156,107,14,0.28)]
              disabled:cursor-not-allowed
              disabled:opacity-45
              disabled:hover:translate-y-0
            "
            >

              <motion.span
                  animate={
                    status === "submitting"
                        ? {
                          x: [0, 4, 0],
                        }
                        : {}
                  }
                  transition={{
                    repeat:
                        status === "submitting"
                            ? Infinity
                            : 0,
                    duration: 0.8,
                  }}
              >
                <Send size={16} />
              </motion.span>

              {status === "submitting"
                  ? "Sending Review..."
                  : "Submit Review"}

            </button>

            <p className="text-center text-[10px] leading-5 text-cocoa/35">
              By submitting, you&apos;re helping us
              improve the experience for every guest.
            </p>

          </div>

        </div>

      </form>
  );
}