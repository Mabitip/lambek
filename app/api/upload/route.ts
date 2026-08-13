import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/auth.config";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { storageService } from "@/lib/storage/storage.service";
import type { PermissionType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.permissions as PermissionType[], "MANAGE_MEDIA")) {
    return apiError("UNAUTHORIZED", "Not authorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) ?? undefined;

    if (!file) return apiError("VALIDATION_ERROR", "No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await storageService.uploadFile({
      filename: file.name,
      mimeType: file.type,
      buffer,
      altText,
    });

    return apiSuccess(media, 201);
  } catch (e) {
    return apiError("UPLOAD_ERROR", e instanceof Error ? e.message : "Upload failed", 400);
  }
}
