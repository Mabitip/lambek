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
  description:
    `Learn about ${BRAND.legalName} — Ethiopian Yirgacheffe green coffee processor and exporter from the Gedeo highlands.`,
  path: "/about",
});

const originHighlights = [
  {
    title: "Ethiopian Origin",
    desc: "The birthplace of coffee — home to more than a thousand diversified coffee types.",
  },
  {
    title: "Gedeo Highlands",
    desc: "High altitude equals high quality. Our coffee comes from the celebrated Yirgacheffe region.",
  },
  {
    title: "Quality Standard",
    desc: "Quality is not a step — it is the standard across sourcing, processing, and export.",
  },
];

export default async function AboutPage() {
  const settings: Record<string, string> = await settingsService.getAll().catch(() => ({}));
  const aboutText = settings.about_text ?? "";
  const values: string[] = settings.values ? JSON.parse(settings.values) : [];
  const services: string[] = settings.services ? JSON.parse(settings.services) : [];

  return (
    <>
      <section className="page-hero-shell relative flex h-[50vh] min-h-[400px] items-end">
        <OptimizedImage src={SITE_IMAGES.hero} alt="Ethiopian coffee highlands" fill priority sizes="100vw" variant="hero" />
        <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
        <div className="relative z-10 px-6 pb-16">
          <h1 className="text-4xl font-semibold text-white md:text-6xl">About</h1>
          <p className="mt-3 max-w-xl text-white/80">Ethiopian origin. Distinctive coffee. Global connection.</p>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <RevealText>
            <SectionHeading eyebrow={`About ${BRAND.wordmark}`} title="From the Gedeo Highlands to the World" />
            <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
              {aboutText.split(". ").map((sentence: string, i: number) =>
                sentence ? <p key={i}>{sentence.trim()}{sentence.endsWith(".") ? "" : "."}</p> : null,
              )}
            </div>
          </RevealText>
          <ImageFrame size="lg" aspect="aspect-square" hover>
            <OptimizedImage src={SITE_IMAGES.farm} alt="Coffee farm in the Gedeo highlands" fill sizes="(max-width: 1024px) 100vw, 50vw" />
          </ImageFrame>
        </div>
      </section>

      <section className="bg-card px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Origin & Quality" title="Why Our Coffee Stands Apart" align="center" />
          <div className="grid gap-8 md:grid-cols-3">
            {originHighlights.map((item) => (
              <RevealText key={item.title}>
                <div className="border border-border p-8">
                  <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                  <p className="mt-3 text-foreground/70">{item.desc}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {values.length > 0 && (
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Values" title="Why Choose Us" align="center" />
            <div className="grid gap-8 md:grid-cols-3">
              {values.map((value) => (
                <RevealText key={value}>
                  <div className="border border-border p-8 text-center">
                    <p className="text-xl font-medium capitalize text-primary">{value}</p>
                  </div>
                </RevealText>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="border-t border-border bg-muted/30 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Services" title="What We Do" />
            <div className="space-y-8">
              {services.map((service, i) => (
                <RevealText key={service}>
                  <div className="flex gap-6 border-b border-border pb-8">
                    <span className="text-4xl font-light text-secondary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg text-foreground/80">{service}</p>
                  </div>
                </RevealText>
              ))}
            </div>
          </div>
        </section>
      )}

      <LocationMapSection />
    </>
  );
}
