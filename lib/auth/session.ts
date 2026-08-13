import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/auth.config";
import type { PermissionName } from "@/lib/constants/brand";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

export async function requirePermission(permission: PermissionName) {
  const session = await requireAuth();
  if (!hasPermission(session.user.permissions, permission)) {
    redirect("/admin/dashboard");
  }
  return session;
}

export async function getOptionalSession() {
  return auth();
}
