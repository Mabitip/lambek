"use client";

import { useState, useMemo } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { GALLERY_IMAGES } from "@/lib/constants/images";
import { cn } from "@/lib/utils/cn";
import { Sparkles } from "lucide-react";

export function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(GALLERY_IMAGES.map((img) => img.category)));
    return ["All", ...unique];
  }, []);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return GALLERY_IMAGES;
    return GALLERY_IMAGES.filter((img) => img.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                isActive
                  ? "bg-[#143525] text-white shadow-md ring-2 ring-secondary/50"
                  : "border border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((image) => (
          <figure
            key={image.src + image.category}
            className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-xl"
          >
            <ImageFrame aspect="aspect-[4/3]" hover className="overflow-hidden">
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </ImageFrame>
            <figcaption className="p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {image.category}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-foreground/40">Lambek Origin</span>
              </div>
              <p className="mt-3 font-serif text-base font-semibold text-primary">{image.alt}</p>
              {"description" in image && image.description && (
                <p className="mt-2 text-xs leading-relaxed text-foreground/70">{image.description}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Origin Quality Banner */}
      <div className="mt-20 rounded-3xl border border-secondary/30 bg-[#0B1E15] p-8 text-center text-white sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 text-secondary mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
          Authentic Ethiopian Coffee Heritage
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          Every micro-lot is grown in the Gedeo highlands, hand-harvested by local farming families, and processed with pure spring water on elevated African beds.
        </p>
      </div>
    </div>
  );
}
