import { requirePermission } from "@/lib/auth/session";
import { sampleService } from "@/lib/services/content.service";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/cn";
import { updateSampleStatusAction } from "@/lib/actions/admin.actions";
import { SAMPLE_STATUSES } from "@/lib/constants/brand";

export default async function AdminSampleRequestsPage() {
  await requirePermission("MANAGE_SAMPLES");
  const { items } = await sampleService.getAll().catch(() => ({ items: [], total: 0, page: 1, limit: 20 }));

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Sample Requests</h1>
      <div className="mt-8 space-y-4">
        {items.map((sample) => (
          <div key={sample.id} className="border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{sample.company}</p>
                <p className="text-sm">{sample.name} · {sample.email}</p>
                {sample.coffee && <p className="text-sm text-foreground/60">Coffee: {sample.coffee.name}</p>}
                {sample.message && <p className="mt-2 text-sm text-foreground/70">{sample.message}</p>}
                <p className="mt-2 text-xs text-foreground/40">{formatDate(sample.createdAt)}</p>
              </div>
              <StatusBadge status={sample.status} />
            </div>
            <form action={updateSampleStatusAction.bind(null, sample.id)} className="mt-4 flex gap-2">
              <select name="status" defaultValue={sample.status} className="h-9 border border-border px-2 text-sm">
                {SAMPLE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button type="submit" className="h-9 bg-primary px-4 text-xs uppercase tracking-wider text-white">
                Update
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="text-foreground/50">No sample requests yet.</p>}
      </div>
    </div>
  );
}
