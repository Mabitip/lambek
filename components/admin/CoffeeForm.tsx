"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coffeeFormSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { slugify } from "@/lib/utils/cn";
import type { z } from "zod";

type CoffeeFormData = z.infer<typeof coffeeFormSchema>;

interface CoffeeFormProps {
  coffee?: Partial<CoffeeFormData & { id: string; tastingNotes: string[] }>;
  origins: { id: string; name: string }[];
  processes: { id: string; name: string }[];
  varieties: { id: string; name: string }[];
  action: (data: CoffeeFormData) => Promise<{ success: boolean; error?: string }>;
}

export function CoffeeForm({ coffee, origins, processes, varieties, action }: CoffeeFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CoffeeFormData>({
    resolver: zodResolver(coffeeFormSchema) as never,
    defaultValues: {
      name: coffee?.name ?? "",
      slug: coffee?.slug ?? "",
      shortDescription: coffee?.shortDescription ?? "",
      description: coffee?.description ?? "",
      region: coffee?.region ?? "",
      microRegion: coffee?.microRegion ?? "",
      country: coffee?.country ?? "Ethiopia",
      altitudeMin: coffee?.altitudeMin,
      altitudeMax: coffee?.altitudeMax,
      harvestPeriod: coffee?.harvestPeriod ?? "",
      cupScore: coffee?.cupScore,
      cupProfile: coffee?.cupProfile ?? "",
      tastingNotes: coffee?.tastingNotes ?? [],
      packaging: coffee?.packaging ?? "",
      processingStory: coffee?.processingStory ?? "",
      qualityInfo: coffee?.qualityInfo ?? "",
      featured: coffee?.featured ?? false,
      published: coffee?.published ?? false,
      seoTitle: coffee?.seoTitle ?? "",
      seoDescription: coffee?.seoDescription ?? "",
      originId: coffee?.originId ?? "",
      processId: coffee?.processId ?? "",
      varietyId: coffee?.varietyId ?? "",
    },
  });

  const name = watch("name");

  async function onSubmit(data: CoffeeFormData) {
    const result = await action(data);
    if (result.success) {
      router.push("/admin/coffees");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input
            {...register("name")}
            onBlur={() => {
              if (!watch("slug")) setValue("slug", slugify(name));
            }}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
      </div>

      <div>
        <Label>Short Description</Label>
        <Textarea {...register("shortDescription")} rows={2} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} rows={4} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label>Origin</Label>
          <Select {...register("originId")}>
            <option value="">Select origin</option>
            {origins.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Process</Label>
          <Select {...register("processId")}>
            <option value="">Select process</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Variety</Label>
          <Select {...register("varietyId")}>
            <option value="">Select variety</option>
            {varieties.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Region</Label>
          <Input {...register("region")} />
        </div>
        <div>
          <Label>Micro Region</Label>
          <Input {...register("microRegion")} />
        </div>
        <div>
          <Label>Altitude Min (m)</Label>
          <Input type="number" {...register("altitudeMin")} />
        </div>
        <div>
          <Label>Altitude Max (m)</Label>
          <Input type="number" {...register("altitudeMax")} />
        </div>
        <div>
          <Label>Harvest Period</Label>
          <Input {...register("harvestPeriod")} />
        </div>
        <div>
          <Label>Cup Score</Label>
          <Input type="number" step="0.1" {...register("cupScore")} />
        </div>
      </div>

      <div>
        <Label>Tasting Notes (comma-separated)</Label>
        <Input
          defaultValue={coffee?.tastingNotes?.join(", ") ?? ""}
          onChange={(e) =>
            setValue(
              "tastingNotes",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            )
          }
        />
      </div>

      <div>
        <Label>Processing Story</Label>
        <Textarea {...register("processingStory")} rows={3} />
      </div>
      <div>
        <Label>Quality Info</Label>
        <Textarea {...register("qualityInfo")} rows={3} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>SEO Title</Label>
          <Input {...register("seoTitle")} />
        </div>
        <div>
          <Label>SEO Description</Label>
          <Textarea {...register("seoDescription")} rows={2} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("featured")} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("published")} />
          Published
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Coffee"}
      </Button>
    </form>
  );
}
