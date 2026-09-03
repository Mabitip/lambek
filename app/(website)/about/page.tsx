import Link from "next/link";
import {
  Mountain,
  Droplets,
  Award,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TreePine,
  Layers,
  MapPin,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { settingsService } from "@/lib/services/coffee.service";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealText } from "@/components/home/RevealText";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { BRAND } from "@/lib/constants/brand";
import { LocationMapSection } from "@/components/layout/LocationMapSection";
import { SITE_IMAGES } from "@/lib/constants/images";

export const metadata = buildMetadata({
  title: "About",
  description: `Learn about ${BRAND.legalName} — Ethiopian Yirgacheffe green coffee processor and exporter from the Gedeo highlands.`,
  path: "/about",
});

const DEFAULT_ABOUT = `Konga Trading PLC is an Ethiopian specialty coffee company and exporter focused exclusively on coffees from the Yirgacheffe region. Headquartered in Addis Ababa, Konga's primary production site is in the Konga micro-region where the company operates a wet mill and a dedicated special-natural preparation facility. Konga connects specialty coffee directly from farmers with high-end roasters around the world, built on traceability, rigorous quality control, and close producer relationships.

Konga was founded and is managed by Takele Mamo, who spent 12 years as General Manager of the Yirgacheffe Coffee Farmers Cooperative Union (YCFCU). That background created deep relationships with growers and allows Konga to offer single-farm coffees rather than only regionally blended lots. Independent importer documentation describes Konga as managing and exporting individually named farmer lots.

Konga operates a controlled value chain from farmers and cherry sourcing through wet-mill processing, raised-bed drying, professional dry-milling in Addis Ababa, quality control, and export to specialty roasters. The company prioritizes sourcing differentiated coffees, building micro-lot traceability, using processing as a value-creation tool, and maintaining professional dry-milling and sorting standards for export.

Product categories include Yirgacheffe Fully Washed (floral, citrus, tea-like), Yirgacheffe Natural (fruit-forward, sweet, complex), Single-Farm Lots (high traceability, individual producer story), and Special Natural / Micro-lots (small-batch, differentiated offerings).

Quality control is applied at every transition point (cherry sourcing, wet mill / natural station, drying, resting/storage, dry mill, cupping, and pre-shipment) and is enforced through documented protocols, moisture monitoring, defect removal, and sensory evaluation. Single-farm traceability is a key differentiator: Konga records producer name, exact location, elevation, variety, harvest period, process type, processing site, drying protocol, physical quality, cup score, and lot code.

Public records show Konga-associated exports to markets including the United States, Japan, and Belgium, with documented buyers such as Royal Coffee. Strategic priorities include deepening structured farmer partnerships with quality incentives, expanding farm-level traceability, standardizing SOPs for processed lots, strengthening QC lab practices, building an annual micro-lot catalogue, and prioritizing repeat roaster/importer relationships.

Konga Trading PLC occupies a distinctive position in Ethiopia's specialty coffee ecosystem as a Yirgacheffe-focused exporter connecting farmers and distinctive lots with international specialty buyers. Company management should verify current facilities, certifications, buyers, export volumes, and financial details before external use.`;

const KEY_STATS = [
  {
    value: "2,000–2,200m",
    label: "Highland Elevation",
    subtext: "Slow cherry maturation & dense bean structure",
    icon: Mountain,
  },
  {
    value: "100%",
    label: "Lot Traceability",
    subtext: "Single-farm & micro-station transparency",
    icon: ShieldCheck,
  },
  {
    value: "Grade 1 & 2",
    label: "Specialty Standard",
    subtext: "Rigorous optical color sorting & cupping",
    icon: Award,
  },
  {
    value: "12+ Years",
    label: "Origin Leadership",
    subtext: "Direct partnership with Gedeo farming families",
    icon: HeartHandshake,
  },
];

const PILLARS = [
  {
    icon: Mountain,
    title: "Highland Microclimates",
    desc: "Grown at 2,000 to 2,200 meters in fertile volcanic soil beneath native shade canopies, developing high density and complex acidity.",
    badge: "Terroir",
  },
  {
    icon: HeartHandshake,
    title: "Direct Producer Linkage",
    desc: "We work directly with smallholder farmers, paying quality premiums and documenting producer identity for every micro-lot.",
    badge: "Traceability",
  },
  {
    icon: Droplets,
    title: "Artisanal Processing",
    desc: "From strict flotation and density separation to 3-week raised-bed sun drying, every step is calibrated for cup clarity.",
    badge: "Craft",
  },
  {
    icon: ShieldCheck,
    title: "Export Precision",
    desc: "Processed in our modern Addis Ababa dry mill with color sorters, gravity tables, and certified Q-grader cupping labs.",
    badge: "Quality Control",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Selective Hand-Picking",
    desc: "Farmers harvest only deep crimson, fully ripe cherries at peak brix sugar content across the Gedeo hills.",
  },
  {
    step: "02",
    title: "Flotation & Density Grading",
    desc: "Cherries enter spring water tanks where less-dense floaters are skimmed away to ensure uniform seed density.",
  },
  {
    step: "03",
    title: "Raised-Bed Sun Drying",
    desc: "Cherries/parchment rest on elevated African beds, turned hourly under strict layer depth to reach 10–12% moisture.",
  },
  {
    step: "04",
    title: "Curing & Stabilization",
    desc: "Dried lots rest in cool warehouses for 4–6 weeks, stabilizing water activity and locking in aromatic complexity.",
  },
  {
    step: "05",
    title: "Dry Milling & Export Lab",
    desc: "Hulled, gravity-separated, optical color-sorted, and cupped in Addis Ababa before export packing in GrainPro liners.",
  },
];

export default async function AboutPage() {
  const settings: Record<string, string> = await settingsService.getAll().catch(() => ({}));
  const aboutText = settings.about_text ?? DEFAULT_ABOUT;
  const values: string[] = settings.values ? JSON.parse(settings.values) : [];
  const services: string[] = settings.services ? JSON.parse(settings.services) : [];

  return (
    <>
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden bg-primary px-6 pb-20 pt-36 text-white md:min-h-[70vh] md:pb-28">
        <OptimizedImage
          src={SITE_IMAGES.hero}
          alt="Ethiopian coffee highlands"
          fill
          priority
          sizes="100vw"
          variant="hero"
          className="scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.12),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-secondary/40 bg-black/40 px-5 py-2 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Gedeo Zone · Yirgacheffe · Ethiopia
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-7xl">
            Roots in the Highlands. <br />
            <span className="italic text-secondary">Crafted for the World.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {BRAND.name} connects specialty green coffee from Ethiopian smallholders to discerning roasteries worldwide — anchored in radical traceability, artisanal processing, and origin mastery.
          </p>

          {/* Quick Stats Highlights */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {KEY_STATS.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md transition hover:border-secondary/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Verified</span>
                </div>
                <p className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-secondary">{stat.label}</p>
                <p className="mt-1 text-[11px] leading-tight text-white/60">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FOUNDER & HERITAGE STORY */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-7">
              <RevealText>
                <div className="mb-4 inline-flex items-center gap-3">
                  <OptimizedImage
                    src={SITE_IMAGES.logoVerticalDarkGreen}
                    alt={BRAND.name}
                    width={44}
                    height={44}
                    className="logo-on-light h-11 w-auto object-contain"
                  />
                  <OptimizedImage
                    src={SITE_IMAGES.logoVerticalGold}
                    alt={BRAND.name}
                    width={44}
                    height={44}
                    className="logo-on-dark h-11 w-auto object-contain"
                  />
                  <div className="border-l border-secondary/40 pl-3">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">About {BRAND.name}</p>
                    <p className="font-serif text-sm font-medium text-foreground/80">{BRAND.legalName}</p>
                  </div>
                </div>

                <SectionHeading
                  eyebrow={`About ${BRAND.wordmark}`}
                  title="From the Gedeo Highlands to the World"
                />

                <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {(aboutText.includes("\n\n")
                    ? aboutText.split("\n\n")
                    : aboutText.split("\n")
                  )
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="leading-relaxed text-foreground/80">
                        {para}
                      </p>
                    ))}
                </div>

                <div className="mt-8 rounded-2xl border border-secondary/30 bg-secondary/10 p-6">
                  <p className="font-serif text-lg italic text-foreground">
                    &ldquo;Quality is not an accident or a final step. It is the uncompromising standard maintained from cherry picking to container seal.&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                    Takele Mamo · Founder & Managing Director (Former YCFCU General Manager)
                  </p>
                </div>
              </RevealText>
            </div>

            {/* Right Column: Layered Visual Gallery */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <ImageFrame size="lg" aspect="aspect-[4/5]" hover className="shadow-2xl">
                  <OptimizedImage
                    src={SITE_IMAGES.farm}
                    alt="Coffee farm in the Gedeo zone"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </ImageFrame>

                {/* Floating Inset Image */}
                <div className="absolute -bottom-8 -left-8 hidden w-3/5 overflow-hidden rounded-2xl border-4 border-card shadow-2xl sm:block">
                  <div className="relative aspect-square">
                    <OptimizedImage
                      src={SITE_IMAGES.processing}
                      alt="Ripe coffee cherries"
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>

                {/* Badge Overlay */}
                <div className="absolute -right-4 -top-4 rounded-2xl border border-secondary/40 bg-card/95 p-4 shadow-xl backdrop-blur-md sm:right-4 sm:top-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary">
                      <TreePine className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">Agroforestry</p>
                      <p className="text-[11px] text-foreground/70">100% Shade-Grown</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR PILLARS OF EXCELLENCE */}
      <section className="border-y border-border bg-card px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="The Standard"
            title="The Four Pillars of Lambek Coffee"
            description="Our integrated value chain controls every variable from soil to shipping, ensuring consistent sensory excellence."
            align="center"
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background/50 p-8 transition duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:bg-background hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-xl font-semibold text-primary">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{pillar.desc}</p>
                </div>

                <div className="mt-6 border-t border-border/50 pt-4">
                  <span className="inline-flex items-center text-xs font-medium uppercase tracking-wider text-secondary transition group-hover:translate-x-1">
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROCESSING METHODOLOGY (WASHED VS NATURAL) */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Processing Craft"
            title="Mastery Across Washed & Natural Profiles"
            description="We harness the distinct microclimates of Yirgacheffe to create clean, expressive coffees with unmistakable origin identity."
            align="center"
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Washed Card */}
            <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-xl">
              <div className="relative h-64 w-full overflow-hidden">
                <OptimizedImage
                  src={SITE_IMAGES.quality}
                  alt="Fully Washed green coffee"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                    Wet-Mill Process
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
                    12–15 Days Drying
                  </span>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <h3 className="font-serif text-2xl font-semibold text-primary sm:text-3xl">Yirgacheffe Fully Washed</h3>
                <p className="mt-3 text-sm font-medium text-secondary">
                  Sensory Profile: Jasmine · Bergamot · Peach · Black Tea · Sparkling Lemon Acidity
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  Selective cherry flotation separates less-dense fruit before mechanical depulping. Parchment undergoes controlled underwater fermentation followed by clean river washing and slow drying on ventilated raised beds.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-border pt-6 text-sm text-foreground/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Double-density flotation sorting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Eco-pulper parchment separation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Constant parchment rotation to 10.5% moisture</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Natural Card */}
            <div className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-xl">
              <div className="relative h-64 w-full overflow-hidden">
                <OptimizedImage
                  src={SITE_IMAGES.drying}
                  alt="Natural coffee drying on beds"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                    Special Natural Process
                  </span>
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
                    21–25 Days Drying
                  </span>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <h3 className="font-serif text-2xl font-semibold text-primary sm:text-3xl">Yirgacheffe Special Natural</h3>
                <p className="mt-3 text-sm font-medium text-secondary">
                  Sensory Profile: Wild Blueberry · Ripe Strawberry · Raw Honey · Milk Chocolate · Creamy Body
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                  Whole ripe cherries are spread in thin single layers on elevated mesh beds. Hand-raked hourly under mountain sun and covered during peak midday heat to ensure gentle, uniform dehydration.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-border pt-6 text-sm text-foreground/80">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Single-layer drying for peak airflow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Hourly hand-turning during daylight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Resting in breathable jute for moisture stability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VALUE CHAIN & QUALITY TIMELINE */}
      <section className="border-t border-border bg-muted/25 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Lifecycle"
            title="The Journey: From Gedeo Soil to Global Port"
            description="A strictly documented 5-stage value chain ensuring zero quality degradation."
            align="center"
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-secondary hover:shadow-md"
              >
                <div>
                  <span className="font-serif text-3xl font-bold text-secondary/40">{step.step}</span>
                  <h4 className="mt-4 font-serif text-lg font-semibold text-primary">{step.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">{step.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-secondary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>QC Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DYNAMIC VALUES / SERVICES IF CONFIGURED */}
      {values.length > 0 && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Core Values" title="What Guides Our Work" align="center" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((val) => (
                <div key={val} className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                  <p className="font-serif text-xl font-semibold capitalize text-primary">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="border-t border-border bg-card px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Capabilities" title="Services for Importers & Roasters" />
            <div className="mt-10 divide-y divide-border">
              {services.map((service, i) => (
                <div key={service} className="flex items-center gap-6 py-6">
                  <span className="font-serif text-3xl font-light text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base text-foreground/80 sm:text-lg">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. LUXURY CTA BANNER */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-secondary/30 bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl sm:px-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              Partner With Us
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Experience the True Character of Ethiopian Yirgacheffe
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Explore our current crop offerings, review lot traceability data, or request cupping sample kits sent directly to your roastery.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/coffee"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-8 text-sm font-semibold uppercase tracking-wider text-secondary-foreground transition hover:bg-secondary/90 hover:shadow-lg"
              >
                Browse Coffees
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Request Samples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE LOCATION MAP */}
      <LocationMapSection />
    </>
  );
}
