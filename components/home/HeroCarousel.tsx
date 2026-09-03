"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils/cn";

export type HeroSlide = {
  src: string;
  alt: string;
  tag?: string;
  title?: string;
};

interface HeroCarouselProps {
  slides: readonly HeroSlide[];
  headline: string;
  subtext: string;
  autoPlayInterval?: number;
}

export function HeroCarousel({
  slides,
  headline,
  subtext,
  autoPlayInterval = 5500,
}: HeroCarouselProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      setActive(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Robust Auto-Play Timer
  useEffect(() => {
    if (reduced || slideCount <= 1) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slideCount);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [reduced, slideCount, autoPlayInterval, active]);

  const currentSlide = slides[active];
  const headlineLines = headline.split("\n");

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
    >
      {/* Background Slides with Ken Burns Effect */}
      <div className="absolute inset-0" aria-live="polite">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.src}
            initial={false}
            animate={{
              opacity: index === active ? 1 : 0,
              scale: index === active ? 1.05 : 1,
            }}
            transition={{
              opacity: { duration: reduced ? 0 : 1.2, ease: "easeInOut" },
              scale: { duration: autoPlayInterval / 1000 + 1, ease: "linear" },
            }}
            className="absolute inset-0"
            aria-hidden={index !== active}
          >
            <OptimizedImage
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              variant="hero"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Luxury Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(201,169,97,0.15),transparent_60%)]" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 pb-32 text-left text-white sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          {/* Active Slide Tag Pill */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-secondary/40 bg-black/50 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              {currentSlide?.tag ?? "Gedeo Zone · Ethiopia"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
            >
              {subtext}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/coffee"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-8 text-sm font-semibold uppercase tracking-wider text-secondary-foreground transition hover:bg-secondary/90 hover:shadow-lg"
            >
              Explore Coffees
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Request a Sample
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Slide Navigation Arrows */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md transition hover:border-secondary hover:bg-black/70 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md transition hover:border-secondary hover:bg-black/70 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Bottom Progress Bars & Slide Selector */}
      <div className="absolute bottom-8 left-6 right-6 z-20 mx-auto flex max-w-7xl items-end justify-between sm:left-8 sm:right-8 lg:left-12 lg:right-12">
        <div className="flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
              className="group flex flex-col items-start gap-1 py-2 text-left"
            >
              <div className="relative h-1.5 w-12 overflow-hidden rounded-full bg-white/25 sm:w-16 md:w-20">
                {index === active && (
                  <motion.div
                    key={`progress-${active}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: autoPlayInterval / 1000,
                      ease: "linear",
                    }}
                    className="h-full rounded-full bg-secondary"
                  />
                )}
                {index < active && <div className="h-full w-full rounded-full bg-secondary/80" />}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] font-semibold uppercase tracking-wider transition sm:block",
                  index === active ? "text-secondary" : "text-white/40 group-hover:text-white/70",
                )}
              >
                0{index + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Counter & Indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-widest text-white/60 backdrop-blur-md sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          <span>
            {String(active + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-white/40 sm:block">
        <ChevronDown className="h-5 w-5" aria-hidden />
      </div>
    </section>
  );
}
