import Link from "next/link";
import { requirePermission } from "@/lib/auth/session";
import { journalService } from "@/lib/services/content.service";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/cn";

export default async function AdminJournalPage() {
  await requirePermission("MANAGE_JOURNAL");
  const { items } = await journalService.getAdminList().catch(() => ({ items: [], total: 0, page: 1, limit: 20 }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-primary">Journal</h1>
        <Button asChild><Link href="/admin/journal/new">New Post</Link></Button>
      </div>
      <div className="mt-8 space-y-3">
        {items.map((post) => (
          <div key={post.id} className="flex items-center justify-between border border-border bg-card p-4">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-foreground/50">
                {post.published ? "Published" : "Draft"} · {formatDate(post.updatedAt)}
              </p>
            </div>
            <Link href={`/admin/journal/${post.id}`} className="text-sm text-primary">Edit</Link>
          </div>
        ))}
        {items.length === 0 && <p className="text-foreground/50">No journal posts yet.</p>}
      </div>
    </div>
  );
}
