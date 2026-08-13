import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AdminUsersPage() {
  await requirePermission("MANAGE_USERS");
  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Users</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-foreground/50">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Roles</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/50 bg-card">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.roles.map((r) => r.role.name).join(", ")}</td>
                <td className="p-4">{user.active ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
