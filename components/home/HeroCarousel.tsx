"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RevealText } from "@/components/home/RevealText";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils/cn";

export type HeroSlide = {
  src: string;
  alt: string;
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
  autoPlayInterval = 6000,
}: HeroCarouselProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

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

  useEffect(() => {
    if (reduced || paused || slideCount <= 1) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slideCount);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [reduced, paused, slideCount, autoPlayInterval]);

  const headlineLines = headline.split("\n");

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      {/* Background slides */}
      <div className="absolute inset-0" aria-live="polite">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.src}
            initial={false}
            animate={{
              opacity: index === active ? 1 : 0,
              scale: index === active ? 1 : 1.04,
            }}
            transition={{
              duration: reduced ? 0 : 1.4,
              ease: [0.22, 1, 0.36, 1],
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
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[var(--hero-overlay)]" />

      {/* Content — left aligned */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-left text-white sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-2xl lg:max-w-3xl">
          <RevealText>
            <h1 className="text-3xl font-semibold uppercase leading-snug tracking-wide sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-tight">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </RevealText>
          <RevealText delay={0.2}>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="mt-5 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base md:text-lg"
              >
                {subtext}
              </motion.p>
            </AnimatePresence>
          </RevealText>
          <RevealText delay={0.4}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/coffee"
                className="inline-flex h-12 w-fit items-center bg-secondary px-8 text-sm font-medium uppercase tracking-widest text-secondary-foreground transition hover:bg-secondary/90"
              >
                Explore Coffee
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 w-fit items-center border border-white/40 px-8 text-sm font-medium uppercase tracking-widest transition hover:bg-white/10"
              >
                Request a Sample
              </Link>
            </div>
          </RevealText>
        </div>
      </div>

      {/* Slide controls */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 border border-white/20 bg-black/20 p-2 text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/40 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 border border-white/20 bg-black/20 p-2 text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/40 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-24 left-6 z-20 flex items-center gap-3 sm:left-8 lg:left-12">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "h-1.5 transition-all duration-300",
                  index === active
                    ? "w-8 bg-secondary"
                    : "w-1.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>

          <p className="absolute bottom-24 right-6 z-20 hidden text-xs uppercase tracking-[0.2em] text-white/50 md:block">
            {String(active + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
          </p>
        </>
      )}

      <div className="absolute bottom-8 left-6 z-10 animate-bounce text-white/60 sm:left-8 lg:left-12">
        <ChevronDown className="h-6 w-6" aria-hidden />
      </div>
    </section>
  );
}
