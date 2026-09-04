import { requirePermission } from "@/lib/auth/session";
import { userRepository } from "@/lib/repositories/user.repository";
import { UsersManager } from "@/components/admin/UsersManager";

export default async function AdminUsersPage() {
  const session = await requirePermission("MANAGE_USERS");
  const users = await userRepository.findAll().catch(() => []);

  return (
    <UsersManager
      initialUsers={JSON.parse(JSON.stringify(users))}
      currentUserId={session.user.id}
    />
  );
}
