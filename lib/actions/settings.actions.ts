"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { settingsRepository } from "@/lib/repositories/coffee.repository";
import { activityRepository } from "@/lib/repositories/content.repository";

export async function getAllSettingsAction() {
  await requirePermission("MANAGE_SETTINGS");
  const settings = await prisma.siteSetting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });
  return settings;
}

export async function updateSettingsAction(
  entries: { key: string; value: string; group?: string }[]
) {
  const session = await requirePermission("MANAGE_SETTINGS");

  for (const entry of entries) {
    if (entry.key && entry.value !== undefined) {
      await settingsRepository.set(entry.key, entry.value, entry.group || "general");
    }
  }

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "SiteSetting",
    details: `Updated ${entries.length} site settings`,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function createCustomSettingAction(data: {
  key: string;
  value: string;
  group: string;
}) {
  const session = await requirePermission("MANAGE_SETTINGS");

  const formattedKey = data.key
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, "_");

  if (!formattedKey) {
    return { success: false, error: "Valid setting key is required" };
  }

  const setting = await prisma.siteSetting.upsert({
    where: { key: formattedKey },
    update: { value: data.value, group: data.group || "custom" },
    create: { key: formattedKey, value: data.value, group: data.group || "custom" },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "SiteSetting",
    details: `Created/updated custom setting ${formattedKey}`,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true, setting };
}

export async function deleteCustomSettingAction(key: string) {
  const session = await requirePermission("MANAGE_SETTINGS");

  await prisma.siteSetting.delete({
    where: { key },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "SiteSetting",
    details: `Deleted setting ${key}`,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}
