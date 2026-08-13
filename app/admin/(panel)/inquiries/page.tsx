import { requirePermission } from "@/lib/auth/session";
import { inquiryService } from "@/lib/services/content.service";
import { formatDate } from "@/lib/utils/cn";

export default async function AdminInquiriesPage() {
  await requirePermission("MANAGE_INQUIRIES");
  const { items } = await inquiryService.getAll().catch(() => ({ items: [], total: 0, page: 1, limit: 20 }));

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Inquiries</h1>
      <div className="mt-8 space-y-4">
        {items.map((inquiry) => (
          <div key={inquiry.id} className="border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{inquiry.fullName}</p>
                <p className="text-sm text-foreground/60">{inquiry.email}</p>
                {inquiry.company && <p className="text-sm">{inquiry.company}</p>}
              </div>
              <span className="text-xs uppercase tracking-wider text-secondary">
                {inquiry.requestType.replace(/_/g, " ")}
              </span>
            </div>
            {inquiry.message && <p className="mt-4 text-sm text-foreground/70">{inquiry.message}</p>}
            <p className="mt-2 text-xs text-foreground/40">{formatDate(inquiry.createdAt)}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-foreground/50">No inquiries yet.</p>}
      </div>
    </div>
  );
}
