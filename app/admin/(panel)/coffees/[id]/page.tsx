import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { coffeeService } from "@/lib/services/coffee.service";
import { CoffeeForm } from "@/components/admin/CoffeeForm";
import { CoffeeEditExtras } from "@/components/admin/CoffeeEditExtras";
import { updateCoffeeAction, deleteCoffeeAction } from "@/lib/actions/coffee.actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoffeePage({ params }: PageProps) {
  await requirePermission("MANAGE_COFFEE");
  const { id } = await params;
  const [coffee, options] = await Promise.all([
    coffeeService.getById(id),
    coffeeService.getFilterOptions(),
  ]);

  if (!coffee) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-primary">Edit Coffee</h1>
        <form
          action={async () => {
            "use server";
            await deleteCoffeeAction(id);
          }}
        >
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Delete
          </button>
        </form>
      </div>
      <div className="mt-8">
        <CoffeeForm
          coffee={{
            id: coffee.id,
            name: coffee.name,
            slug: coffee.slug,
            shortDescription: coffee.shortDescription ?? undefined,
            description: coffee.description ?? undefined,
            region: coffee.region ?? undefined,
            microRegion: coffee.microRegion ?? undefined,
            country: coffee.country,
            altitudeMin: coffee.altitudeMin ?? undefined,
            altitudeMax: coffee.altitudeMax ?? undefined,
            harvestPeriod: coffee.harvestPeriod ?? undefined,
            cupScore: coffee.cupScore ?? undefined,
            cupProfile: coffee.cupProfile ?? undefined,
            tastingNotes: coffee.tastingNotes,
            packaging: coffee.packaging ?? undefined,
            processingStory: coffee.processingStory ?? undefined,
            qualityInfo: coffee.qualityInfo ?? undefined,
            featured: coffee.featured,
            published: coffee.published,
            seoTitle: coffee.seoTitle ?? undefined,
            seoDescription: coffee.seoDescription ?? undefined,
            originId: coffee.originId ?? undefined,
            processId: coffee.processId ?? undefined,
            varietyId: coffee.varietyId ?? undefined,
          }}
          origins={options.origins}
          processes={options.processes}
          varieties={options.varieties}
          action={(data) => updateCoffeeAction(id, data)}
        />

        <CoffeeEditExtras
          coffeeId={coffee.id}
          lots={coffee.lots}
          availability={coffee.availability}
          images={coffee.images.map((img) => ({
            id: img.id,
            mediaId: img.mediaId,
            url: img.media.url,
            altText: img.media.altText,
            originalName: img.media.originalName,
          }))}
        />
      </div>
    </div>
  );
}
