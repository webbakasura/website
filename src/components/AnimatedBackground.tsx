"use client";

import { useEffect, useState } from "react";
import BiryaniMotif from "./BiryaniMotif";

type Ember = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  tone: string;
};

const TONES = ["bg-gold-deep", "bg-maroon-bright", "bg-emerald", "bg-gold"];

function makeEmbers(count: number): Ember[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 3 + Math.random() * 6,
    duration: 12 + Math.random() * 14,
    delay: Math.random() * 12,
    drift: Math.random() * 60 - 30,
    tone: TONES[i % TONES.length],
  }));
}

export default function AnimatedBackground() {
  const [embers, setEmbers] = useState<Ember[] | null>(null);

  useEffect(() => {
    setEmbers(makeEmbers(18));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-biryani-gradient" />
      <div className="absolute inset-0 bg-spice-pattern opacity-70" />
      <div className="absolute inset-0 bg-noise" />

      <BiryaniMotif className="absolute -bottom-10 -left-16 h-64 w-64 rotate-[-8deg] text-gold-deep/[0.09] sm:h-80 sm:w-80" />
      <BiryaniMotif className="absolute -bottom-16 -right-14 h-72 w-72 rotate-[10deg] scale-x-[-1] text-maroon-bright/[0.08] sm:h-96 sm:w-96" />
      <BiryaniMotif className="absolute -top-20 right-1/4 h-48 w-48 rotate-[18deg] text-emerald/[0.06] sm:h-64 sm:w-64" />

      {embers?.map((e) => (
        <span
          key={e.id}
          className={`absolute bottom-0 rounded-full ${e.tone} blur-[1px]`}
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              opacity: 0.35,
              "--drift": `${e.drift}px`,
              animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
