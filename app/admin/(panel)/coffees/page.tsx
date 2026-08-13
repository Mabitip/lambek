import Link from "next/link";
import { requirePermission } from "@/lib/auth/session";
import { coffeeRepository } from "@/lib/repositories/coffee.repository";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminCoffeesPage() {
  await requirePermission("MANAGE_COFFEE");
  const { items } = await coffeeRepository.findAllAdmin(1, 50).catch(() => ({ items: [], total: 0, page: 1, limit: 50 }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-primary">Coffees</h1>
        <Button asChild>
          <Link href="/admin/coffees/new">Add Coffee</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-foreground/50">
              <th className="p-4">Name</th>
              <th className="p-4">Origin</th>
              <th className="p-4">Process</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((coffee) => (
              <tr key={coffee.id} className="border-b border-border/50 bg-card">
                <td className="p-4 font-medium">{coffee.name}</td>
                <td className="p-4">{coffee.origin?.name ?? "—"}</td>
                <td className="p-4">{coffee.process?.name ?? "—"}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {coffee.published && <StatusBadge status="AVAILABLE" />}
                    {coffee.featured && <StatusBadge status="LIMITED" />}
                    {!coffee.published && <StatusBadge status="UNAVAILABLE" />}
                  </div>
                </td>
                <td className="p-4">
                  <Link href={`/admin/coffees/${coffee.id}`} className="text-primary hover:text-secondary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="mt-8 text-center text-foreground/50">No coffees yet. Add your first coffee.</p>
        )}
      </div>
    </div>
  );
}
