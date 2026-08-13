import { requirePermission } from "@/lib/auth/session";
import { mediaRepository } from "@/lib/repositories/content.repository";
import { MediaUploaderPanel } from "@/components/admin/ImageUploader";
import { formatDate } from "@/lib/utils/cn";
import Image from "next/image";

export default async function AdminMediaPage() {
  await requirePermission("MANAGE_MEDIA");
  const { items } = await mediaRepository.findAll().catch(() => ({ items: [], total: 0, page: 1, limit: 24 }));

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Media Library</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Upload images for coffee listings and journal posts. Supported: JPEG, PNG, WebP, GIF, PDF (max 5MB).
      </p>

      <div className="mt-8 max-w-xl">
        <MediaUploaderPanel />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((media) => (
          <div key={media.id} className="border border-border bg-card p-3">
            {media.mimeType.startsWith("image/") ? (
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image src={media.url} alt={media.altText ?? media.filename} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted text-sm">PDF</div>
            )}
            <p className="mt-2 truncate text-xs font-medium">{media.originalName}</p>
            <p className="text-xs text-foreground/40">{formatDate(media.createdAt)}</p>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="mt-8 text-foreground/50">No media uploaded yet.</p>}
    </div>
  );
}
