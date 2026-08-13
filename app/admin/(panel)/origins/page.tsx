import { requirePermission } from "@/lib/auth/session";
import { originRepository, processRepository } from "@/lib/repositories/coffee.repository";

export default async function AdminOriginsPage() {
  await requirePermission("MANAGE_ORIGIN");
  const [origins, processes] = await Promise.all([
    originRepository.findAll().catch(() => []),
    processRepository.findAll().catch(() => []),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Origins & Processes</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-xl">Origins</h2>
          <div className="space-y-3">
            {origins.map((origin) => (
              <div key={origin.id} className="border border-border bg-card p-4">
                <p className="font-medium">{origin.name}</p>
                <p className="text-sm text-foreground/60">{origin.country} · {origin.zone}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-4 font-serif text-xl">Processes</h2>
          <div className="space-y-3">
            {processes.map((process) => (
              <div key={process.id} className="border border-border bg-card p-4">
                <p className="font-medium">{process.name}</p>
                {process.description && (
                  <p className="text-sm text-foreground/60">{process.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
