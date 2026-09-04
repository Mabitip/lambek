import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { MediaManager } from "@/components/admin/MediaManager";

export default async function AdminMediaPage() {
  await requirePermission("MANAGE_MEDIA");

  const mediaList = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  }).catch(() => []);

  return (
    <MediaManager initialMedia={JSON.parse(JSON.stringify(mediaList))} />
  );
}
