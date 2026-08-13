import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { settingsService, coffeeService } from "@/lib/services/coffee.service";
import { RevealText, StatsCounter } from "@/components/home/RevealText";
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
      <HeroCarousel
        slides={HERO_SLIDES}
        headline={hero.headline}
        subtext={hero.subtext}
        autoPlayInterval={6000}
      />

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <ImageFrame size="lg" aspect="aspect-[4/5]" hover>
            <OptimizedImage
              src={SITE_IMAGES.origin}
              alt="Gedeo highlands landscape"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </ImageFrame>
          <RevealText>
            <SectionHeading
              eyebrow="Origin"
              title="The Origin Matters"
              description="Born in the Gedeo Highlands — home to Ethiopian Yirgacheffe green coffee, carefully processed and prepared for the world."
            />
            <p className="mb-4 text-foreground/70 leading-relaxed">
              {BRAND.legalName} is a processor and exporter of Ethiopian Yirgacheffe green coffee beans from the Gedeo highlands. Our prime assets are our hardworking employees and the farmers around us.
            </p>
            <p className="mb-8 text-sm uppercase tracking-wider text-secondary">Gedeo Zone · Yirgacheffe · Ethiopia</p>
            <Link
              href="/about"
              className="inline-flex items-center text-sm uppercase tracking-widest text-primary transition hover:text-secondary"
            >
              Learn About Us →
            </Link>
          </RevealText>
        </div>
      </section>

      <section className="bg-card px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Lambek Profile"
            title="Ethiopian Origin. Global Connection."
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCounter value="YIRGACHEFFE" label="Origin" />
            <StatsCounter value="GEDEO" label="Coffee Zone" />
            <StatsCounter value="ETHIOPIA" label="Country" />
            <StatsCounter value="GREEN COFFEE" label="Product" />
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Coffee"
            title="Featured Coffees"
            description="Explore our selection of Ethiopian green coffee — traceable, carefully processed, and prepared for specialty roasters."
          />
          <CoffeeGrid coffees={featuredCoffees} />
          <div className="mt-12 text-center">
            <Link
              href="/coffee"
              className="inline-flex h-11 items-center border border-primary px-8 text-sm uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              View All Coffee
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          {[
            { title: "Unique Coffee", desc: "Ethiopia has more than a thousand diversified coffee types." },
            { title: "Traceable Quality", desc: "High quality, traceable coffee directly from farmers to roasters." },
            { title: "Hand Harvested", desc: "We care about the plants and harvest them by hand." },
          ].map((item) => (
            <RevealText key={item.title}>
              <h3 className="font-serif text-2xl text-primary">{item.title}</h3>
              <p className="mt-3 text-foreground/70">{item.desc}</p>
            </RevealText>
          ))}
        </div>
      </section>

      <LocationMapSection />
    </>
  );
}
