"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { activityRepository } from "@/lib/repositories/content.repository";

export async function uploadMediaAction(data: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  url: string;
  storageKey?: string;
}) {
  const session = await requirePermission("MANAGE_MEDIA");

  const media = await prisma.media.create({
    data: {
      filename: data.filename,
      originalName: data.originalName,
      mimeType: data.mimeType,
      size: data.size,
      width: data.width,
      height: data.height,
      altText: data.altText,
      url: data.url,
      storageKey: data.storageKey || `media_${Date.now()}_${data.filename}`,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "Media",
    entityId: media.id,
    details: `Uploaded media ${media.filename}`,
  });

  revalidatePath("/admin/media");
  return { success: true, media };
}

export async function deleteMediaAction(id: string) {
  const session = await requirePermission("MANAGE_MEDIA");
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { success: false, error: "Media not found" };

  await prisma.media.delete({ where: { id } });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "Media",
    entityId: id,
    details: `Deleted media ${media.filename}`,
  });

  revalidatePath("/admin/media");
  return { success: true };
}
