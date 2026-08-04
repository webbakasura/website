"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

type Review = {
  id: string;
  name: string;
  message: string | null;
  overall_rating: string;
  created_at: string;
};

/*
 * Decorative food images
 *
 * Review 1 -> 1.png
 * Review 2 -> 2.png
 * Review 3 -> 3.png
 * Review 4 -> 4.png
 * Review 5 -> 5.png
 * Review 6 -> 1.png again
 */
const REVIEW_IMAGES = [
  "/images/reviews/1.png",
  "/images/reviews/2.png",
  "/images/reviews/3.png",
  "/images/reviews/4.png",
  "/images/reviews/5.png",
];

function getStarCount(rating: string) {
  switch (rating) {
    case "Poor":
      return 1;

    case "Fair":
      return 2;

    case "Good":
      return 3;

    case "Excellent":
      return 5;

    default:
      return 0;
  }
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "G";
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  /*
   * Fetch approved reviews
   */
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("/api/feedback", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Reviews API error:", data);

          throw new Error(
              data.error || "Failed to fetch reviews"
          );
        }

        setReviews(data.reviews ?? []);
      } catch (error) {
        console.error(
            "Failed to load reviews:",
            error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  /*
   * Horizontal carousel
   */
  function scroll(direction: "left" | "right") {
    const container = scrollRef.current;

    if (!container) return;

    const amount = container.clientWidth * 0.8;

    container.scrollBy({
      left:
          direction === "right"
              ? amount
              : -amount,
      behavior: "smooth",
    });
  }

  return (
      <section className="relative z-10 overflow-hidden px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">

          {/* ================================
            HEADING
        ================================= */}

          <div className="text-center">

            <div className="divider-ornament mb-3 text-xs font-semibold tracking-[0.4em] text-gold-deep">
              CUSTOMER REVIEWS
            </div>

            <h2 className="font-display text-2xl font-bold uppercase text-ink sm:text-3xl">
              Fresh Out of the{" "}
              <span className="text-gold-gradient">
              Kitchen
            </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cocoa/60">
              Real experiences shared by our customers.
            </p>

          </div>

          {/* ================================
            LOADING
        ================================= */}

          {loading ? (

              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {Array.from({ length: 3 }).map(
                    (_, index) => (
                        <div
                            key={index}
                            className="
                    h-[320px]
                    animate-pulse
                    rounded-[28px]
                    border
                    border-gold-deep/10
                    bg-white/50
                  "
                        />
                    )
                )}

              </div>

          ) : reviews.length > 0 ? (

              /* ================================
                  REVIEWS CAROUSEL
              ================================= */

              <div className="relative mt-10">

                {/* LEFT BUTTON */}

                {reviews.length > 1 && (
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        aria-label="Previous reviews"
                        className="
                  absolute
                  -left-5
                  top-1/2
                  z-30
                  hidden
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gold-deep/15
                  bg-white/95
                  text-gold-deep
                  shadow-[0_8px_30px_rgba(67,44,18,0.10)]
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:scale-105
                  hover:border-gold-deep/30
                  lg:flex
                "
                    >
                      <ChevronLeft size={19} />
                    </button>
                )}

                {/* ================================
                REVIEWS
            ================================= */}

                <div
                    ref={scrollRef}
                    className="
                flex
                snap-x
                snap-mandatory
                gap-5
                overflow-x-auto
                scroll-smooth
                pb-5
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
                >

                  {reviews.map((review, index) => {

                    const starCount =
                        getStarCount(
                            review.overall_rating
                        );

                    const foodImage =
                        REVIEW_IMAGES[
                        index %
                        REVIEW_IMAGES.length
                            ];

                    return (

                        /* ================================
                            REVIEW CARD
                        ================================= */

                        <motion.article
                            key={review.id}
                            initial={{
                              opacity: 0,
                              y: 20,
                            }}
                            whileInView={{
                              opacity: 1,
                              y: 0,
                            }}
                            viewport={{
                              once: true,
                              amount: 0.2,
                            }}
                            transition={{
                              duration: 0.45,
                              delay: Math.min(
                                  index * 0.06,
                                  0.25
                              ),
                            }}
                            className="
                      group
                      relative
                      flex
                      min-h-[320px]
                      min-w-[88%]
                      snap-start
                      flex-col
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-gold-deep/10
                      bg-gradient-to-br
                      from-white/95
                      via-white/90
                      to-[#fffaf0]/85
                      p-6
                      text-left
                      shadow-[0_14px_45px_rgba(67,44,18,0.07)]
                      backdrop-blur-md
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-gold-deep/20
                      hover:shadow-[0_20px_55px_rgba(67,44,18,0.11)]
                      sm:min-w-[420px]
                      lg:min-w-[calc((100%-2.5rem)/3)]
                    "
                        >

                          {/* ================================
                        DECORATIVE WARM GLOW
                    ================================= */}

                          <div
                              className="
                        pointer-events-none
                        absolute
                        -bottom-20
                        -right-20
                        h-56
                        w-56
                        rounded-full
                        bg-gold/5
                        blur-3xl
                      "
                          />

                          {/* ================================
                        FOOD IMAGE
                        Bottom-right corner
                    ================================= */}

                          <div
                              className="
                        pointer-events-none
                        absolute
                        -bottom-4
                        -right-4
                        z-0
                        h-36
                        w-36
                        sm:h-40
                        sm:w-40
                      "
                          >

                            {/* Very subtle glow */}

                            <div
                                className="
                          absolute
                          bottom-2
                          right-2
                          h-24
                          w-24
                          rounded-full
                          bg-gold/5
                          blur-3xl
                        "
                            />

                            {/* FOOD */}

                            <img
                                src={foodImage}
                                alt=""
                                aria-hidden="true"
                                className="
                          relative
                          h-full
                          w-full
                          object-contain
                          object-bottom
                          opacity-[0.32]
                          saturate-[0.90]
                          contrast-[1.03]
                          mix-blend-multiply
                          transition-all
                          duration-700
                          ease-out
                          group-hover:scale-[1.04]
                          group-hover:opacity-[0.42]
                        "
                            />

                          </div>

                          {/* ================================
                        CONTENT
                    ================================= */}

                          <div className="relative z-10 flex h-full flex-1 flex-col">

                            {/* ================================
                          AVATAR + QUOTE
                      ================================= */}

                            <div className="flex items-start justify-between">

                              <div
                                  className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-gold-deep/15
                            bg-gradient-to-br
                            from-gold/15
                            to-white
                            shadow-sm
                          "
                              >
                          <span className="font-display text-lg font-bold text-gold-deep">
                            {getInitial(review.name)}
                          </span>
                              </div>

                              <Quote
                                  size={27}
                                  strokeWidth={1.5}
                                  className="text-gold-deep/20"
                              />

                            </div>

                            {/* ================================
                          REVIEW MESSAGE
                      ================================= */}

                            <div className="mt-6 flex-1 pr-2">

                              <p className="line-clamp-4 text-sm font-medium leading-7 text-cocoa/85">

                                {review.message
                                    ? `“${review.message}”`
                                    : "Thank you for sharing your experience with us."}

                              </p>

                            </div>

                            {/* ================================
                          CUSTOMER DETAILS
                      ================================= */}

                            <div className="relative mt-6 border-t border-gold-deep/10 pt-5">

                              {/*
                          Keep content away from
                          the food image.
                        */}

                              <div className="max-w-[64%]">

                                {/* NAME */}

                                <p className="font-display text-base font-bold text-ink">
                                  {review.name}
                                </p>

                                <p className="mt-1 text-xs font-medium text-cocoa/50">
                                  Customer Review
                                </p>

                                {/* ================================
                              STARS
                          ================================= */}

                                <div className="mt-4 flex items-center gap-0.5">

                                  {Array.from({
                                    length: 5,
                                  }).map((_, i) => (

                                      <Star
                                          key={i}
                                          size={17}
                                          strokeWidth={1.8}
                                          className={
                                            i < starCount
                                                ? "fill-gold-deep text-gold-deep"
                                                : "text-gold-deep/20"
                                          }
                                      />

                                  ))}

                                </div>

                                {/* RATING */}

                                <p className="mt-2 text-sm font-bold text-gold-deep">
                                  {review.overall_rating}
                                </p>

                              </div>

                            </div>

                          </div>

                        </motion.article>
                    );
                  })}

                </div>

                {/* ================================
                RIGHT BUTTON
            ================================= */}

                {reviews.length > 1 && (
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        aria-label="Next reviews"
                        className="
                  absolute
                  -right-5
                  top-1/2
                  z-30
                  hidden
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gold-deep/15
                  bg-white/95
                  text-gold-deep
                  shadow-[0_8px_30px_rgba(67,44,18,0.10)]
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:scale-105
                  hover:border-gold-deep/30
                  lg:flex
                "
                    >
                      <ChevronRight size={19} />
                    </button>
                )}

                {/* MOBILE SWIPE HINT */}

                {reviews.length > 1 && (
                    <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa/35 lg:hidden">
                      Swipe to explore reviews
                    </p>
                )}

              </div>

          ) : (

              /* ================================
                  NO REVIEWS
              ================================= */

              <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="
              mx-auto
              mt-10
              max-w-xl
              rounded-[28px]
              border
              border-gold-deep/10
              bg-gradient-to-br
              from-white/95
              to-[#fffaf0]/80
              px-8
              py-10
              text-center
              shadow-[0_12px_40px_rgba(67,44,18,0.05)]
            "
              >

                <div className="flex justify-center gap-1">

                  {Array.from({
                    length: 5,
                  }).map((_, i) => (

                      <Star
                          key={i}
                          size={19}
                          className="text-gold-deep/25"
                      />

                  ))}

                </div>

                <p className="mt-5 text-sm leading-relaxed text-cocoa/70">
                  We&apos;re fresh out of the kitchen and
                  waiting for our first customer review.
                </p>

              </motion.div>

          )}

          {/* ================================
            LEAVE REVIEW BUTTON
        ================================= */}

          <div className="mt-8 text-center">

            <Link
                href="/feedback"
                className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-gold-deep/30
              bg-white/40
              px-6
              py-2.5
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-gold-deep
              transition
              duration-300
              hover:border-gold-deep
              hover:bg-gold/10
            "
            >
              Share Your Experience

              <ArrowRight size={14} />
            </Link>

          </div>

        </div>
      </section>
  );
}