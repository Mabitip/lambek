"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalFormSchema } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils/cn";
import type { z } from "zod";

type JournalFormData = z.infer<typeof journalFormSchema>;

interface JournalFormProps {
  post?: Partial<JournalFormData & { id: string }>;
  categories: { id: string; name: string }[];
  tags?: { id: string; name: string }[];
  action: (data: JournalFormData) => Promise<{ success: boolean; error?: string }>;
}

export function JournalForm({ post, categories, tags = [], action }: JournalFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalFormSchema) as never,
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      categoryId: post?.categoryId ?? "",
      featured: post?.featured ?? false,
      published: post?.published ?? false,
      publishedAt: post?.publishedAt ?? "",
      scheduledAt: post?.scheduledAt ?? "",
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
      tagIds: post?.tagIds ?? [],
    },
  });

  const title = watch("title");

  async function onSubmit(data: JournalFormData) {
    const result = await action(data);
    if (result.success) {
      router.push("/admin/journal");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input
            {...register("title")}
            onBlur={() => {
              if (!watch("slug")) setValue("slug", slugify(title));
              if (!watch("seoTitle")) setValue("seoTitle", title);
            }}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} />
        </div>
      </div>

      <div>
        <Label>Excerpt</Label>
        <Textarea {...register("excerpt")} rows={2} />
      </div>

      <div>
        <Label>Content</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} className="mt-1" />
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Select {...register("categoryId")}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        {tags.length > 0 && (
          <div>
            <Label>Tags</Label>
            <select
              multiple
              {...register("tagIds")}
              className="mt-1 h-24 w-full border border-border px-3 text-sm"
            >
              {tags.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Publish Date</Label>
          <Input type="datetime-local" {...register("publishedAt")} />
        </div>
        <div>
          <Label>Schedule For</Label>
          <Input type="datetime-local" {...register("scheduledAt")} />
        </div>
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
        {isSubmitting ? "Saving..." : "Save Post"}
      </Button>
    </form>
  );
}
