import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { SectionHeading } from "@/components/ui/section-heading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { GALLERY_IMAGES, SITE_IMAGES } from "@/lib/constants/images";

export const metadata = buildMetadata({
  title: "Gallery",
  description: `Explore Ethiopian coffee origin photography from ${BRAND.name}.`,
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero-shell relative flex h-[50vh] min-h-[400px] items-end">
        <OptimizedImage src={SITE_IMAGES.origin} alt="Ethiopian coffee landscape" fill priority sizes="100vw" variant="hero" />
        <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
        <div className="relative z-10 px-6 pb-16">
          <h1 className="text-4xl font-semibold text-white md:text-6xl">Gallery</h1>
          <p className="mt-3 max-w-xl text-white/80">
            A visual journey through Ethiopian coffee — from highland farms to export-ready green beans.
          </p>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Coffee in Pictures"
            description="Ethiopian origin imagery showcasing our farms, processing, and quality workflow."
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_IMAGES.map((image) => (
              <figure key={image.src} className="media-card group">
                <ImageFrame aspect="aspect-[4/3]" hover>
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </ImageFrame>
                <figcaption className="p-4">
                  <p className="text-xs uppercase tracking-widest text-secondary">{image.category}</p>
                  <p className="mt-1 text-sm text-foreground/70">{image.alt}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
