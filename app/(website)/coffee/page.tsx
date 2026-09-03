import { Suspense } from "react";
import Link from "next/link";
import {
  Sparkles,
  HeartHandshake,
  Flame,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mountain,
  Droplets,
  Award,
  Leaf,
  Layers,
  Phone,
  Compass,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { coffeeService } from "@/lib/services/coffee.service";
import { SectionHeading } from "@/components/ui/section-heading";
import { CoffeeGrid } from "@/components/coffee/CoffeeCard";
import { CoffeeFilter } from "@/components/coffee/CoffeeFilter";
import { TraceabilitySearch } from "@/components/coffee/TraceabilitySearch";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SITE_IMAGES } from "@/lib/constants/images";

export const metadata = buildMetadata({
  title: "Coffee | Where Tradition Meets Aroma",
  description: `Where Tradition Meets Aroma. Explore ${BRAND.name}'s selection of Ethiopian Yirgacheffe green coffee — single-farm lots, washed and natural micro-lots.`,
  path: "/coffee",
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const FLAVOR_ATTRIBUTES = [
  {
    title: "Floral & Aromatic Notes",
    desc: "Intense jasmine, orange blossom, and bergamot aromatics characteristic of pristine Gedeo terroir.",
    icon: Sparkles,
  },
  {
    title: "Bright Yet Refined Acidity",
    desc: "Sparkling citric and stonefruit acidity balanced by high elevation and slow cherry maturation.",
    icon: Mountain,
  },
  {
    title: "Sweetness with Complexity",
    desc: "Layers of raw wildflower honey, ripe peach, and milk chocolate developed through careful curing.",
    icon: Droplets,
  },
  {
    title: "Clean, Lingering Finish",
    desc: "Silky mouthfeel and pristine cup clarity achieved through double-density sorting and clean river washing.",
    icon: Award,
  },
];

const BRAND_PROMISES = [
  { title: "Consistency you can rely on", desc: "Uniform density, calibrated moisture (10–12%), and repeatable cup quality harvest after harvest." },
  { title: "Transparency you can trust", desc: "Full traceability to individual farm locations, harvest dates, varieties, and wet mill stations." },
  { title: "Quality that speaks for itself", desc: "Specialty Grade 1 & 2 coffees scoring 86+ to 89+ with distinct sensory identities." },
  { title: "Partnerships built for the long term", desc: "Direct, collaborative relationships with roasters and fair price premiums for smallholders." },
];

const FOUR_PILLARS = [
  {
    tag: "Pillar 01",
    title: "A Legacy Brewed Over Time",
    subtitle: "Patience, Discipline & Long-Term Vision",
    icon: Compass,
    content:
      "Lambek Coffee was not built overnight. It is the result of years of consistent quality management, deep-rooted tradition, and an unwavering commitment to excellence. From the highlands where our coffee is grown to the final cup enjoyed across the world, LAMBEK represents patience, discipline, and respect for coffee as both an art and a livelihood.\n\nOur legacy is defined by long-term thinking. We do not chase quick gains; LAMBEK Coffee has always focused on sustainability—of quality, of relationships, and of trust. This mindset has allowed us to produce coffee that is not only exceptional in flavor but also consistent year after year.",
    highlights: ["Decade of Origin Mastery", "Zero Compromise on Quality", "Sustainable Relationship Building"],
  },
  {
    tag: "Pillar 02",
    title: "Empowering Farmers, Strengthening Communities",
    subtitle: "The Human Heart of Every Harvest",
    icon: HeartHandshake,
    content:
      "At the heart of LAMBEK Coffee are the farmers. We believe that great coffee begins with supported, respected, and empowered producers. That is why farmer support is not a side activity—it is a core pillar of our business model.\n\nBy investing in farmers, we invest in better coffee, stronger communities, and a sustainable future. When farmers thrive, quality follows naturally.",
    bulletsTitle: "Our farmer-focused approach includes:",
    bullets: [
      "Long-term relationships instead of transactional buying",
      "Knowledge sharing on best agronomic practices",
      "Support for quality improvement at farm level",
      "Fair and transparent engagement",
    ],
  },
  {
    tag: "Pillar 03",
    title: "Bold Enough to Take Risks!",
    subtitle: "Innovation Across Profiles & Processes",
    icon: Flame,
    content:
      "Progress requires courage. LAMBEK Coffee is bold enough to take calculated risks—whether it is adopting new processing methods, entering demanding markets, or investing ahead of returns.\n\nThis boldness allows LAMBEK Coffee to stay ahead, remain relevant, and continuously elevate its offerings for the world's most demanding roasters.",
    bulletsTitle: "We are not afraid to:",
    bullets: [
      "Experiment with flavor profiles & micro-lot preparations",
      "Improve systems before problems arise",
      "Commit resources to long-term quality gains",
      "Challenge conventional supply chain approaches",
    ],
  },
  {
    tag: "Pillar 04",
    title: "Rooted in Origin, Crafted for the World!",
    subtitle: "Terroir Precision & Systematic QC",
    icon: Globe2,
    content:
      "LAMBEK Coffee is deeply connected to its origin. Our coffees are shaped by altitude, soil, climate, and human care—the true elements of terroir. Yet our vision is global. We craft coffees that meet and exceed the expectations of specialty buyers, roasters, and consumers around the world.\n\nQuality at Lambek Coffee is not an inspection at the end—it is a system that starts at the farm and continues through every step of the value chain.",
    bulletsTitle: "Our quality management approach includes:",
    bullets: [
      "Careful selection of indigenous planting materials",
      "Close monitoring of farming and shade practices",
      "Selective harvesting at optimal cherry ripeness",
      "Controlled processing and raised-bed drying",
      "Strict grading and certified cupping evaluation",
    ],
  },
];

const VISION_POINTS = [
  "Raising quality standards across every lot",
  "Expanding farmer impact & community premiums",
  "Strengthening direct global roastery partnerships",
  "Preserving Ethiopian tradition while embracing innovation",
];

export default async function CoffeePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = {
    origin: typeof params.origin === "string" ? params.origin : undefined,
    process: typeof params.process === "string" ? params.process : undefined,
    variety: typeof params.variety === "string" ? params.variety : undefined,
    availability: typeof params.availability === "string" ? params.availability : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
  };

  const [{ items, totalPages, page }, filterOptions] = await Promise.all([
    coffeeService.getPublished(filters).catch(() => ({ items: [], totalPages: 0, page: 1, total: 0, limit: 12 })),
    coffeeService.getFilterOptions().catch(() => ({ origins: [], processes: [], varieties: [] })),
  ]);

  return (
    <>
      {/* 1. CINEMATIC COFFEE HERO SECTION */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden bg-black px-6 pb-20 pt-36 text-white md:min-h-[70vh] md:pb-28">
        <OptimizedImage
          src={SITE_IMAGES.drying}
          alt="Ethiopian specialty green coffee drying on raised beds"
          fill
          priority
          sizes="100vw"
          variant="hero"
          className="scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.14),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-secondary/40 bg-black/50 px-5 py-2 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Where Tradition Meets Aroma
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-7xl">
            Specialty Green Coffee <br />
            <span className="italic text-secondary">From the Gedeo Highlands</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
            Our coffees are carefully developed to express their unique origin while delivering balance, depth, and character. Every bean honors generations of Ethiopian heritage, elevated by precision processing.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#catalog"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-8 text-xs font-semibold uppercase tracking-widest text-secondary-foreground transition hover:bg-secondary/90 hover:shadow-lg"
            >
              Browse Offerings
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#philosophy"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Our Philosophy & Story
            </a>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY: WHERE TRADITION MEETS AROMA */}
      <section id="philosophy" className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
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
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Brand Philosophy</p>
                  <p className="font-serif text-sm font-medium text-foreground/80">{BRAND.name}</p>
                </div>
              </div>

              <SectionHeading
                eyebrow="Our Story & Identity"
                title="Where Tradition Meets Aroma"
              />

              <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
                <p>
                  Our tagline, <strong className="font-serif text-primary">&ldquo;Where Tradition Meets Aroma,&rdquo;</strong> is more than a phrase—it is our philosophy.
                </p>
                <p>
                  <strong className="text-primary">Tradition</strong> reflects generations of knowledge, time-tested farming practices, and deep cultural respect for coffee as Ethiopia’s greatest gift to the world.
                </p>
                <p>
                  <strong className="text-primary">Aroma</strong> represents innovation, precision processing, and the bold sensory experience that defines Lambek Coffee.
                </p>
                <p className="border-l-2 border-secondary/60 pl-4 font-serif italic text-foreground">
                  At Lambek, heritage and innovation walk hand in hand. We honor the wisdom of the past while embracing modern quality systems to unlock the full aromatic and flavor potential of every bean.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {BRAND_PROMISES.map((promise) => (
                  <div key={promise.title} className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-secondary">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <p className="font-serif text-sm font-semibold text-primary">{promise.title}</p>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">{promise.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Flavor Attributes Showcase */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-secondary/30 bg-card p-8 shadow-xl sm:p-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-secondary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-primary">Sensory Signature</h3>
                    <p className="text-xs text-foreground/60">Rich, Layered & Captivating</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-foreground/75">
                  Lambek Coffee is recognized for its rich, layered flavor and captivating aroma. Our coffees are carefully developed to express their origin while delivering balance, depth, and character.
                </p>

                <div className="mt-8 space-y-5 border-t border-border pt-6">
                  {FLAVOR_ATTRIBUTES.map((attr) => (
                    <div key={attr.title} className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                        <attr.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-semibold text-primary">{attr.title}</h4>
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">{attr.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Specialty Cup Scores: 86 – 89+
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GREEN COFFEE CATALOG & FILTER ENGINE */}
      <section id="catalog" className="border-t border-border bg-muted/20 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Current Offerings"
            title="Explore Our Green Coffee Catalog"
            description="Traceable single-farm lots, washed microlots, and fruit-forward special naturals ready for specialty roasters."
            align="center"
          />

          <div className="mt-12">
            <Suspense fallback={<div className="mb-10 h-32 animate-pulse rounded-2xl bg-muted" />}>
              <CoffeeFilter
                origins={filterOptions.origins.map((o) => ({ slug: o.slug, name: o.name }))}
                processes={filterOptions.processes.map((p) => ({ slug: p.slug, name: p.name }))}
                varieties={filterOptions.varieties.map((v) => ({ slug: v.slug, name: v.name }))}
              />
            </Suspense>
          </div>

          <div className="mt-10">
            <CoffeeGrid coffees={items} />
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/coffee?page=${p}#catalog`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                    p === page
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. THE 4 PILLARS OF EXCELLENCE */}
      <section className="border-t border-border bg-card px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Core Identity"
            title="The Pillars That Define Lambek Coffee"
            description="Our foundation is built on long-term sustainability, farmer empowerment, calculated boldness, and rigorous terroir systems."
            align="center"
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {FOUR_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-border bg-background p-8 transition duration-300 hover:border-secondary/60 hover:shadow-xl sm:p-10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl font-bold text-primary sm:text-3xl">{pillar.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-secondary">{pillar.subtitle}</p>

                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                    {pillar.content.split("\n\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {pillar.highlights && (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
                      {pillar.highlights.map((h) => (
                        <span key={h} className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {pillar.bullets && (
                    <div className="mt-6 border-t border-border pt-6">
                      {pillar.bulletsTitle && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                          {pillar.bulletsTitle}
                        </p>
                      )}
                      <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                        {pillar.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COFFEE LOT TRACEABILITY ENGINE */}
      <section className="border-t border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Transparency Passport"
            title="Coffee Lot Traceability"
            description="Search by lot ID, coffee name, origin, or process to view verified elevation, harvest date, and cupping scores."
            align="center"
          />
          <div className="mt-10">
            <TraceabilitySearch />
          </div>
        </div>
      </section>

      {/* 6. OUR VISION FORWARD & TRUST PROMISE CTA */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-secondary/40 bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl sm:px-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              <Sparkles className="h-3.5 w-3.5" />
              Our Vision Forward
            </span>

            <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              More Than Coffee — A Brand You Can Trust
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Lambek Coffee is not just a product; it is a promise. Every cup tells a story—from the soil it grew in to the hands that nurtured it.
            </p>

            {/* Vision commitments */}
            <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 md:grid-cols-4">
              {VISION_POINTS.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  <p className="mt-2 text-xs font-medium leading-relaxed text-white/90">{point}</p>
                </div>
              ))}
            </div>

            {/* Contact Details & Direct Actions */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/15 pt-10">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Globe2 className="h-4 w-4" />
                <span className="font-mono">www.lambekcoffee.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Phone className="h-4 w-4" />
                <span className="font-mono">+251 988 22 3344</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-8 text-xs font-semibold uppercase tracking-widest text-secondary-foreground transition hover:bg-secondary/90 hover:shadow-lg"
              >
                Inquire for Wholesale Lots
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact?tab=sample"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Request Sample Kit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
