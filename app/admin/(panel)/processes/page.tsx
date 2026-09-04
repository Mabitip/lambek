import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { OriginsProcessesManager } from "@/components/admin/OriginsProcessesManager";

export default async function AdminProcessesPage() {
  await requirePermission("MANAGE_COFFEE");

  const [origins, processes] = await Promise.all([
    prisma.coffeeOrigin.findMany({ orderBy: { name: "asc" } }).catch(() => []),
    prisma.coffeeProcess.findMany({ orderBy: { name: "asc" } }).catch(() => []),
  ]);

  return (
    <OriginsProcessesManager
      initialOrigins={JSON.parse(JSON.stringify(origins))}
      initialProcesses={JSON.parse(JSON.stringify(processes))}
    />
  );
}
