"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { journalRepository } from "@/lib/repositories/content.repository";
import { journalFormSchema } from "@/lib/validations/schemas";
import { journalService, activityService } from "@/lib/services/content.service";

export async function createJournalAction(data: unknown) {
  await requirePermission("MANAGE_JOURNAL");
  const parsed = journalFormSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const { categoryId, tagIds, publishedAt, scheduledAt, ...rest } = parsed.data;
  const readingTime = journalService.computeReadingTime(rest.content);

  await journalRepository.create({
    ...rest,
    readingTime,
    publishedAt: publishedAt ? new Date(publishedAt) : rest.published ? new Date() : null,
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    ...(categoryId && { category: { connect: { id: categoryId } } }),
    ...(tagIds.length > 0 && {
      tags: {
        create: tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    }),
  });

  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  return { success: true };
}

export async function updateJournalAction(id: string, data: unknown) {
  await requirePermission("MANAGE_JOURNAL");
  const parsed = journalFormSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const { categoryId, tagIds, publishedAt, scheduledAt, ...rest } = parsed.data;
  const readingTime = journalService.computeReadingTime(rest.content);

  await journalRepository.update(id, {
    ...rest,
    readingTime,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
  });

  await activityService.log({ action: "UPDATE", entityType: "JournalPost", entityId: id });
  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  return { success: true };
}

export async function updateSampleStatusAction(id: string, formData: FormData) {
  await requirePermission("MANAGE_SAMPLES");
  const status = formData.get("status") as string;
  const { sampleService } = await import("@/lib/services/content.service");
  await sampleService.updateStatus(id, status);
  revalidatePath("/admin/sample-requests");
}

export async function updateSettingsAction(entries: { key: string; value: string; group?: string }[]) {
  await requirePermission("MANAGE_SETTINGS");
  const { settingsRepository } = await import("@/lib/repositories/coffee.repository");
  await settingsRepository.setMany(entries);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
