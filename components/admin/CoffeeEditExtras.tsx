"use client";

import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CoffeeExtras } from "@/components/admin/CoffeeExtras";
import {
  addCoffeeLotAction,
  updateCoffeeAvailabilityAction,
  attachCoffeeImageAction,
  removeCoffeeImageAction,
} from "@/lib/actions/coffee.actions";

interface CoffeeEditExtrasProps {
  coffeeId: string;
  lots: { id: string; lotId: string; harvest?: string | null; cupProfile?: string | null; published: boolean }[];
  availability: { id: string; status: string; notes?: string | null }[];
  images: { id: string; mediaId: string; url: string; altText?: string | null; originalName: string }[];
}

export function CoffeeEditExtras({ coffeeId, lots, availability, images }: CoffeeEditExtrasProps) {
  const router = useRouter();

  return (
    <>
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-serif text-xl text-primary">Coffee Images</h2>
        <p className="mt-1 text-sm text-foreground/60">Upload images for this coffee listing.</p>
        <div className="mt-4">
          <ImageUploader
            existingImages={images.map((img) => ({
              id: img.id,
              url: img.url,
              altText: img.altText,
              originalName: img.originalName,
            }))}
            onUploaded={async (media) => {
              await attachCoffeeImageAction(coffeeId, media.id, images.length === 0);
              router.refresh();
            }}
            onRemove={async (imageId) => {
              await removeCoffeeImageAction(coffeeId, imageId);
              router.refresh();
            }}
          />
        </div>
      </section>

      <CoffeeExtras
        coffeeId={coffeeId}
        lots={lots}
        availability={availability}
        onAddLot={async (data) => {
          await addCoffeeLotAction(coffeeId, data);
          router.refresh();
        }}
        onUpdateAvailability={async (status, notes) => {
          await updateCoffeeAvailabilityAction(coffeeId, status, notes);
          router.refresh();
        }}
      />
    </>
  );
}
