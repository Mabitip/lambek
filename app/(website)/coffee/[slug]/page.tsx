import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/lib/seo/json-ld";
import { coffeeService } from "@/lib/services/coffee.service";
import { CoffeePassport } from "@/components/coffee/CoffeePassport";
import { SITE_IMAGES } from "@/lib/constants/images";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { getSiteUrl } from "@/lib/utils/cn";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const coffee = await coffeeService.getBySlug(slug);
  if (!coffee) return {};
  return buildMetadata({
    title: coffee.seoTitle ?? coffee.name,
    description: coffee.seoDescription ?? coffee.shortDescription ?? `Ethiopian green coffee from ${BRAND.name}.`,
    path: `/coffee/${slug}`,
  });
}

export default async function CoffeeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const coffee = await coffeeService.getBySlug(slug);
  if (!coffee) notFound();

  const primaryImage =
    coffee.images.find((i) => i.isPrimary)?.media.url ??
    coffee.images[0]?.media.url ??
    SITE_IMAGES.placeholder;

  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(coffee),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Coffee", url: `${siteUrl}/coffee` },
            { name: coffee.name, url: `${siteUrl}/coffee/${slug}` },
          ]),
        ]}
      />

      <section className="page-hero-shell relative h-[60vh] min-h-[400px]">
        <Image src={primaryImage} alt={coffee.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-0 px-6 pb-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-widest text-secondary">
              {coffee.origin?.name ?? coffee.region}
            </p>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">{coffee.name}</h1>
            {coffee.shortDescription && (
              <p className="mt-4 max-w-2xl text-lg text-white/80">{coffee.shortDescription}</p>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-12">
            {coffee.description && (
              <div>
                <h2 className="mb-4 text-3xl font-semibold">About This Coffee</h2>
                <p className="leading-relaxed text-foreground/80">{coffee.description}</p>
              </div>
            )}

            {coffee.processingStory && (
              <div>
                <h2 className="mb-4 text-3xl font-semibold">Processing Story</h2>
                <p className="leading-relaxed text-foreground/80">{coffee.processingStory}</p>
              </div>
            )}

            {coffee.qualityInfo && (
              <div>
                <h2 className="mb-4 text-3xl font-semibold">Quality Information</h2>
                <p className="leading-relaxed text-foreground/80">{coffee.qualityInfo}</p>
              </div>
            )}

            {coffee.images.length > 1 && (
              <div>
                <h2 className="mb-6 text-3xl font-semibold">Gallery</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {coffee.images.slice(1).map((img) => (
                    <ImageFrame key={img.id} aspect="aspect-[4/3]" hover>
                      <Image
                        src={img.media.url}
                        alt={img.media.altText ?? coffee.name}
                        fill
                        className="object-cover"
                      />
                    </ImageFrame>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CoffeePassport coffee={coffee} />
        </div>
      </section>

      <section className="border-t border-border bg-primary px-6 py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-3xl font-semibold">Request a Sample</h2>
            <p className="mt-2 text-primary-foreground/70">Experience this coffee before you buy.</p>
          </div>
          <Link
            href={`/contact?coffee=${slug}`}
            className="inline-flex h-12 items-center bg-secondary px-8 text-sm uppercase tracking-widest text-secondary-foreground"
          >
            Request Sample
          </Link>
        </div>
      </section>
    </>
  );
}
