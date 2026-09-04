import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { CoffeesManager } from "@/components/admin/CoffeesManager";

export default async function AdminCoffeesPage() {
  await requirePermission("MANAGE_COFFEE");

  const [coffees, origins, processes] = await Promise.all([
    prisma.coffee.findMany({
      include: {
        origin: true,
        process: true,
        variety: true,
        profile: true,
        images: { include: { media: true } },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.coffeeOrigin.findMany({ orderBy: { name: "asc" } }).catch(() => []),
    prisma.coffeeProcess.findMany({ orderBy: { name: "asc" } }).catch(() => []),
  ]);

  return (
    <CoffeesManager
      initialCoffees={JSON.parse(JSON.stringify(coffees))}
      origins={JSON.parse(JSON.stringify(origins))}
      processes={JSON.parse(JSON.stringify(processes))}
    />
  );
}
