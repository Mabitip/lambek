import Link from "next/link";
import {
  Mountain,
  Droplets,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TreePine,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { settingsService, coffeeService } from "@/lib/services/coffee.service";
import { RevealText } from "@/components/home/RevealText";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CoffeeGrid } from "@/components/coffee/CoffeeCard";
import { SectionHeading } from "@/components/ui/section-heading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { BRAND } from "@/lib/constants/brand";
import { LocationMapSection } from "@/components/layout/LocationMapSection";
import { HERO_SLIDES, SITE_IMAGES } from "@/lib/constants/images";

export const metadata = buildMetadata({
  title: `${BRAND.name} | Ethiopian Yirgacheffe Green Coffee Exporter`,
  description:
    "High quality, traceable Ethiopian Yirgacheffe green coffee from the Gedeo highlands. Processor and exporter supplying specialty roasters worldwide.",
  path: "/",
});

const HOME_STATS = [
  { value: "YIRGACHEFFE", label: "Celebrated Origin", sub: "Gedeo Zone, Ethiopia", icon: Mountain },
  { value: "2,000–2,200m", label: "Elevation", sub: "Dense highland beans", icon: Layers },
  { value: "100% TRACEABLE", label: "Single-Farm Lots", sub: "Direct producer link", icon: ShieldCheck },
  { value: "GRADE 1 & 2", label: "Export Standard", sub: "Optical & sensory QC", icon: Award },
];

const FEATURES = [
  {
    icon: Mountain,
    title: "Diverse Arabica Varieties",
    desc: "Ethiopia is the birthplace of coffee with thousands of naturally occurring heirloom and regional landraces.",
    tag: "Terroir",
  },
  {
    icon: Droplets,
    title: "Artisanal Processing",
    desc: "Double-density flotation, eco-pulping, and 3-week raised-bed sun drying tailored to preserve delicate florals.",
    tag: "Processing",
  },
  {
    icon: ShieldCheck,
    title: "Single-Farm Traceability",
    desc: "Every micro-lot preserves individual farmer identity, altitude, harvest date, and cup profile from farm to roastery.",
    tag: "Transparency",
  },
];

export default async function HomePage() {
  const [hero, featuredCoffees, settings] = await Promise.all([
    settingsService.getHeroContent().catch(() => ({
      headline: "FROM THE HIGHLANDS\nOF YIRGACHEFFE",
      subtext: "Exceptional Ethiopian coffee, carefully processed and prepared for the world.",
    })),
    coffeeService.getFeatured(6).catch(() => []),
    settingsService.getAll().catch(() => ({})),
  ]);

  return (
    <>
      {/* 1. AUTO-SLIDING HERO CAROUSEL */}
      <HeroCarousel
        slides={HERO_SLIDES}
        headline={hero.headline}
        subtext={hero.subtext}
        autoPlayInterval={5500}
      />

      {/* 2. STATS & ORIGIN SNAPSHOT BAR */}
      <section className="border-b border-border bg-card px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_STATS.map((stat) => (
              <div
                key={stat.label}
                className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-5 transition duration-300 hover:border-secondary/60 hover:bg-background hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold tracking-tight text-primary sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-foreground/60">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ORIGIN SPOTLIGHT */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <ImageFrame size="lg" aspect="aspect-[4/5]" hover className="shadow-2xl">
                <OptimizedImage
                  src={SITE_IMAGES.origin}
                  alt="Gedeo highlands landscape"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </ImageFrame>

              {/* Floating Quality Stamp */}
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-secondary/40 bg-card/95 p-5 shadow-2xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-serif text-sm font-bold text-primary">Specialty Grade 1 & 2</p>
                    <p className="text-[11px] uppercase tracking-wider text-foreground/70">88+ Cup Scores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <RevealText>
              <div className="mb-4 inline-flex items-center gap-3">
                <OptimizedImage
                  src={SITE_IMAGES.logoVerticalDarkGreen}
                  alt={BRAND.name}
                  width={40}
                  height={40}
                  className="logo-on-light h-10 w-auto object-contain"
                />
                <OptimizedImage
                  src={SITE_IMAGES.logoVerticalGold}
                  alt={BRAND.name}
                  width={40}
                  height={40}
                  className="logo-on-dark h-10 w-auto object-contain"
                />
                <div className="border-l border-secondary/40 pl-3">
                  <span className="block text-xs font-bold uppercase tracking-[0.25em] text-secondary">
                    Heritage & Terroir
                  </span>
                  <span className="text-[11px] text-foreground/60">Gedeo Zone · Ethiopia</span>
                </div>
              </div>

              <SectionHeading
                eyebrow="Origin Matters"
                title="Born in the Cradle of Specialty Arabica"
                description="The Gedeo highlands combine high elevation, rich red volcanic soil, and indigenous shade canopies to create unmatched flavor complexity."
              />

              <p className="mt-6 text-base leading-relaxed text-foreground/80 sm:text-lg">
                {BRAND.legalName} connects high-altitude smallholder farmers from the renowned Yirgacheffe region directly with international specialty roasteries. Built on radical lot traceability and rigorous quality protocols, every harvest represents the pinnacle of Ethiopian coffee craftsmanship.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/80 bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Altitude</p>
                  <p className="mt-1 font-serif text-lg font-bold text-primary">2,000 to 2,200 MASL</p>
                  <p className="mt-1 text-xs text-foreground/60">Enables dense bean cell structure</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Processing</p>
                  <p className="mt-1 font-serif text-lg font-bold text-primary">Washed & Natural</p>
                  <p className="mt-1 text-xs text-foreground/60">Precision raised-bed curing</p>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary transition hover:text-secondary"
                >
                  Our Full Story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/gallery"
                  className="text-sm font-medium uppercase tracking-widest text-foreground/60 transition hover:text-primary"
                >
                  View Origin Gallery
                </Link>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* 4. THREE PILLARS FEATURE CARDS */}
      <section className="border-y border-border bg-card px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why Lambek"
            title="The Three Pillars of Sourcing Excellence"
            description="From selective ripe cherry intake to container sealing in Addis Ababa, our value chain is designed for cup clarity and freshness."
            align="center"
          />

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {FEATURES.map((item) => (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background/50 p-8 transition duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:bg-background hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl font-semibold text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.desc}</p>
                </div>

                <div className="mt-8 border-t border-border/60 pt-4">
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-secondary transition group-hover:translate-x-1">
                    Explore Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED COFFEES SHOWCASE */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionHeading
                eyebrow="Curated Lots"
                title="Featured Green Coffees"
                description="Explore our current crop offerings — traceable micro-lots, fully washed lots, and fruit-forward special naturals."
              />
            </div>
            <Link
              href="/coffee"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-primary px-7 text-xs font-semibold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              All Offerings ({featuredCoffees.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12">
            <CoffeeGrid coffees={featuredCoffees} />
          </div>

          <div className="mt-16 rounded-3xl border border-secondary/30 bg-primary/5 p-8 text-center sm:p-12">
            <h3 className="font-serif text-2xl font-semibold text-primary sm:text-3xl">
              Looking for Custom Profiles or Container Inquiries?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
              We partner directly with specialty importers and commercial roasteries for contracted forward-booking and customized lot selections.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-8 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:bg-primary/90 hover:shadow-lg"
              >
                Inquire for Wholesale
              </Link>
              <Link
                href="/contact?tab=sample"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/30 bg-card px-8 text-xs font-semibold uppercase tracking-widest text-primary transition hover:bg-primary/5"
              >
                Request Green Samples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CRAFT PROCESSING SPOTLIGHT (WASHED VS NATURAL) */}
      <section className="border-t border-border bg-card px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Craft Profiles"
            title="The Art of Washed & Natural Processing"
            description="Two distinct processing expressions crafted from the same high-altitude Gedeo terroir."
            align="center"
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Washed Card */}
            <div className="group overflow-hidden rounded-3xl border border-border bg-background p-8 shadow-sm transition hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Fully Washed
                </span>
                <span className="text-xs text-foreground/50">12–15 Days Raised Beds</span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-primary">Floral, Citrus & Tea-Like Elegance</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                Pulping with fresh spring water followed by controlled fermentation yields pristine clarity, jasmine florals, bergamot, and sweet lemon acidity.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Jasmine", "Bergamot", "Peach", "Black Tea", "Sparkling Acidity"].map((note) => (
                  <span key={note} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground/80">
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Natural Card */}
            <div className="group overflow-hidden rounded-3xl border border-border bg-background p-8 shadow-sm transition hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                  Special Natural
                </span>
                <span className="text-xs text-foreground/50">21–25 Days Sun-Drying</span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-primary">Wild Blueberry, Honey & Sweet Stonefruit</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                Single-layer sun-drying on elevated African beds develops intense fruit sugars, silky mouthfeel, and deep blueberry-honey richness.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Wild Blueberry", "Ripe Strawberry", "Raw Honey", "Milk Chocolate", "Silky Body"].map((note) => (
                  <span key={note} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground/80">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE LOCATION & ORIGIN MAP */}
      <LocationMapSection />
    </>
  );
}
