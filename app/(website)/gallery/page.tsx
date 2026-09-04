import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { SectionHeading } from "@/components/ui/section-heading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SITE_IMAGES } from "@/lib/constants/images";
import { GalleryClient } from "./GalleryClient";

export const metadata = buildMetadata({
  title: "Gallery | Ethiopian Coffee Origin Photography",
  description: `Explore authentic Ethiopian green coffee origin photography from ${BRAND.name} — highland farms, cherries, washed processing, drying beds, and export preparation.`,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero-shell relative flex min-h-[460px] items-end overflow-hidden bg-[#0B1E15] px-6 pb-16 pt-32 text-white sm:min-h-[500px] md:pb-20">
        <OptimizedImage
          src={SITE_IMAGES.hero}
          alt="Ethiopian coffee highlands landscape"
          fill
          priority
          sizes="100vw"
          variant="hero"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E15] via-[#0B1E15]/75 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-secondary/40 bg-black/50 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Origin In Pictures
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Origin & Craft Gallery
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            A visual documentation of Lambek Coffee in the Gedeo highlands — from shade-grown trees and selective cherry harvesting to wet washing stations, elevated drying beds, and Grade 1 green bean preparation.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Visual Portfolio"
            title="The Origin Journey in Focus"
            description="Explore our sustainable agroforestry farms, pure spring-water washing stations, and export-grade green coffee."
            align="center"
          />

          <div className="mt-14">
            <GalleryClient />
          </div>
        </div>
      </section>
    </>
  );
}
