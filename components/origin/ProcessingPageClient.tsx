"use client";

import { useState } from "react";
import { RevealText } from "@/components/home/RevealText";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SITE_IMAGES } from "@/lib/constants/images";

const steps = [
  "Harvest",
  "Sorting",
  "Processing",
  "Drying",
  "Preparation",
  "Quality Control",
  "Export",
];

export default function ProcessingPageClient() {
  const [activeTab, setActiveTab] = useState<"washed" | "natural">("washed");

  return (
    <>
      <section className="relative flex h-[50vh] min-h-[400px] items-end">
        <OptimizedImage
          src={SITE_IMAGES.processing}
          alt="Coffee cherries on branch"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
        <div className="relative z-10 px-6 pb-16 text-white">
          <h1 className="font-serif text-5xl md:text-7xl">Processing</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            The processing methods we use are carefully applied to preserve the distinctive character of Ethiopian coffee.
          </p>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-2">
            {steps.map((step, i) => (
              <RevealText key={step}>
                <div className="flex flex-col items-center">
                  <div className="border border-primary/30 bg-card px-8 py-4 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-secondary">
                      Step {i + 1}
                    </p>
                    <p className="font-serif text-2xl uppercase tracking-wider text-primary">
                      {step}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="py-2 text-2xl text-secondary">↓</div>
                  )}
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="relative mb-12 aspect-[16/9] overflow-hidden">
            <OptimizedImage
              src={SITE_IMAGES.drying}
              alt="Coffee drying on raised beds"
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <div className="mb-8 flex gap-4">
            {(["washed", "natural"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm uppercase tracking-widest transition ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground/70 hover:border-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="prose-konga">
            {activeTab === "washed" ? (
              <p>
                Washed processing removes the fruit before drying, producing a clean cup profile characteristic of many Yirgacheffe coffees. Specific processing details for each lot are available through our traceability system.
              </p>
            ) : (
              <p>
                Natural processing dries coffee cherries with the fruit intact, developing deeper fruit-forward characteristics. Our team applies careful attention during drying to ensure quality standards are maintained.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
