"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { SITE_IMAGES } from "@/lib/constants/images";
import type { CoffeeWithRelations } from "@/lib/repositories/coffee.repository";

function getAvailability(coffee: CoffeeWithRelations) {
  return coffee.availability[0]?.status ?? "UNAVAILABLE";
}

function getPrimaryImage(coffee: CoffeeWithRelations) {
  const primary = coffee.images.find((img) => img.isPrimary) ?? coffee.images[0];
  return primary?.media.url ?? SITE_IMAGES.placeholder;
}

export function CoffeeCard({ coffee }: { coffee: CoffeeWithRelations }) {
  const availability = getAvailability(coffee);

  return (
    <article className="media-card group">
      <ImageFrame aspect="aspect-[4/5]" hover className="rounded-b-none border-0 shadow-none">
        <Image
          src={getPrimaryImage(coffee)}
          alt={coffee.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </ImageFrame>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {coffee.origin && <Badge variant="outline">{coffee.origin.name}</Badge>}
          {coffee.process && <Badge variant="gold">{coffee.process.name}</Badge>}
          <Badge variant={availability === "AVAILABLE" ? "success" : "default"}>
            {availability.replace(/_/g, " ")}
          </Badge>
        </div>
        <h3 className="font-serif text-2xl text-foreground">{coffee.name}</h3>
        {coffee.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{coffee.shortDescription}</p>
        )}
        <div className="mt-4 space-y-1 text-xs uppercase tracking-wider text-foreground/50">
          {coffee.variety && <p>Variety: {coffee.variety.name}</p>}
          {(coffee.altitudeMin || coffee.altitudeMax) && (
            <p>
              Altitude: {coffee.altitudeMin ?? "?"}–{coffee.altitudeMax ?? "?"}m
            </p>
          )}
          {coffee.tastingNotes.length > 0 && (
            <p>Notes: {coffee.tastingNotes.join(", ")}</p>
          )}
          {coffee.cupScore && <p>Cup Score: {coffee.cupScore}</p>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/coffee/${coffee.slug}`}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary transition hover:text-secondary"
          >
            View Coffee <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/contact?coffee=${coffee.slug}`}
            className="text-sm uppercase tracking-wider text-foreground/60 transition hover:text-primary"
          >
            Request Sample
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CoffeeGrid({ coffees }: { coffees: CoffeeWithRelations[] }) {
  if (coffees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-20 text-center">
        <p className="font-serif text-2xl uppercase tracking-wider">No Coffees Available</p>
        <p className="mt-2 text-foreground/60">
          Our current coffee selection is being updated. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {coffees.map((coffee) => (
        <CoffeeCard key={coffee.id} coffee={coffee} />
      ))}
    </div>
  );
}
