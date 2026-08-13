import { requirePermission } from "@/lib/auth/session";
import { processRepository } from "@/lib/repositories/coffee.repository";

export default async function AdminProcessesPage() {
  await requirePermission("MANAGE_ORIGIN");
  const processes = await processRepository.findAll().catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Processing Methods</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Reference processing methods used for coffee classification and filtering.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {processes.map((process) => (
          <div key={process.id} className="border border-border bg-card p-6">
            <h2 className="font-serif text-xl text-primary">{process.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground/40">{process.slug}</p>
            {process.description && (
              <p className="mt-3 text-sm text-foreground/70">{process.description}</p>
            )}
          </div>
        ))}
        {processes.length === 0 && (
          <p className="text-foreground/50">No processing methods defined. Run database seed.</p>
        )}
      </div>
    </div>
  );
}
