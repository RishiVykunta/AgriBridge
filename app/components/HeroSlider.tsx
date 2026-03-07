"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export type HeroSlide = {
  id: number;
  src: string;
  alt: string;
  href: string;
  title?: string;
  ctaText?: string;
  targetId?: string; // optional section ID to scroll to
};

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1771478501/Seed_Detail_with_Background_of_Fresh_Seedlings_lyebzo.png",
    alt: "Agriculture banner 1",
    href: "#todays-offers-section",
    title: "Quality Seeds for Better Harvest",
    ctaText: "Buy Now",
    targetId: "todays-offers-section",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1771480447/Dawn_Farm_Landscape_with_Innovative_Technology_1_sftq5k.png",
    alt: "Agriculture banner 2",
    href: "#new-arrivals-section",
    title: "Farm Equipment & Solutions",
    ctaText: "Explore",
    targetId: "new-arrivals-section",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dqcxekzxn/image/upload/v1771480249/Golden_Hour_Organic_Farm_Banner_1_ojqqxc.png",
    alt: "Agriculture banner 3",
    href: "#seeds-section",
    title: "Organic Farming Essentials",
    ctaText: "Shop Now",
    targetId: "seeds-section",
  },
];

const INTERVAL_MS = 2000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToTarget = (targetId?: string) => {
    if (!targetId || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    const el = document.getElementById(targetId);
    if (!el) return;

    const headerOffset = 96; // keep in sync with HomeHeader
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % SLIDES.length);
      }, INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[78vh] w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative h-full w-full overflow-hidden">
              {/* Ken Burns Zoom Effect */}
              <img
                src={slide.src}
                alt={slide.alt}
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-linear ${
                  i === index ? "scale-110" : "scale-100"
                }`}
              />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Bottom Right CTA */}
              {slide.ctaText && (
                <div
                  className={`absolute bottom-8 right-6 sm:right-10 md:right-16 transition-all duration-1000 ${
                    i === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="relative inline-block">
                    {/* Gradient Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 blur-xl opacity-70 rounded-xl"></div>

                    <Link
                      href={slide.href}
                      onClick={(e) => {
                        if (slide.targetId) {
                          e.preventDefault();
                          scrollToTarget(slide.targetId);
                        }
                      }}
                      className="relative inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm sm:text-base md:text-lg font-semibold text-white hover:bg-emerald-700 transition duration-300"
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-emerald-500 scale-125"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
