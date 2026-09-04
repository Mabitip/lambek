"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requirePermission, requireAuth } from "@/lib/auth/session";
import { userRepository } from "@/lib/repositories/user.repository";
import { activityRepository } from "@/lib/repositories/content.repository";
import type { RoleType } from "@prisma/client";

export async function getUsersAction() {
  await requirePermission("MANAGE_USERS");
  return userRepository.findAll();
}

export async function getRolesAction() {
  await requirePermission("MANAGE_USERS");
  return userRepository.getAllRoles();
}

export async function createUserAction(formData: {
  name: string;
  email: string;
  password: string;
  roleNames: RoleType[];
  active?: boolean;
}) {
  const session = await requirePermission("MANAGE_USERS");

  if (!formData.name || !formData.email || !formData.password) {
    return { success: false, error: "Name, email, and password are required" };
  }

  if (formData.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  const existing = await userRepository.findByEmail(formData.email);
  if (existing) {
    return { success: false, error: "A user with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(formData.password, 12);

  const newUser = await userRepository.create({
    name: formData.name,
    email: formData.email,
    passwordHash,
    roleNames: formData.roleNames.length > 0 ? formData.roleNames : ["EDITOR" as RoleType],
    active: formData.active ?? true,
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "User",
    entityId: newUser.id,
    details: `Created user ${newUser.name} (${newUser.email}) with roles: ${formData.roleNames.join(", ")}`,
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  return { success: true, user: newUser };
}

export async function updateUserAction(
  id: string,
  formData: {
    name: string;
    email: string;
    roleNames: RoleType[];
    active: boolean;
  }
) {
  const session = await requirePermission("MANAGE_USERS");

  if (!formData.name || !formData.email) {
    return { success: false, error: "Name and email are required" };
  }

  const existing = await userRepository.findByEmail(formData.email);
  if (existing && existing.id !== id) {
    return { success: false, error: "Another user is already using this email" };
  }

  // Check if removing last super admin
  const userToUpdate = await userRepository.findById(id);
  const isSuperAdmin = userToUpdate?.roles.some((r) => r.role.name === "SUPER_ADMIN");
  const willRemainSuperAdmin = formData.roleNames.includes("SUPER_ADMIN" as RoleType);

  if (isSuperAdmin && !willRemainSuperAdmin) {
    const superAdminCount = await userRepository.countSuperAdmins();
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot remove the SUPER_ADMIN role from the last active Super Admin" };
    }
  }

  const updatedUser = await userRepository.update(id, {
    name: formData.name,
    email: formData.email,
    roleNames: formData.roleNames,
    active: formData.active,
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "User",
    entityId: id,
    details: `Updated user ${updatedUser.name} (${updatedUser.email})`,
  });

  revalidatePath("/admin/users");
  return { success: true, user: updatedUser };
}

export async function toggleUserActiveAction(id: string, active: boolean) {
  const session = await requirePermission("MANAGE_USERS");

  if (id === session.user.id && !active) {
    return { success: false, error: "You cannot deactivate your own account" };
  }

  const user = await userRepository.findById(id);
  if (!user) return { success: false, error: "User not found" };

  if (user.roles.some((r) => r.role.name === "SUPER_ADMIN") && !active) {
    const superAdminCount = await userRepository.countSuperAdmins();
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot deactivate the only active Super Admin" };
    }
  }

  await userRepository.update(id, { active });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "User",
    entityId: id,
    details: `${active ? "Activated" : "Deactivated"} user ${user.name}`,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function resetUserPasswordAction(id: string, newPassword: string) {
  const session = await requirePermission("MANAGE_USERS");

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await userRepository.update(id, { passwordHash });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "User",
    entityId: id,
    details: `Reset password for user ID ${id}`,
  });

  return { success: true };
}

export async function deleteUserAction(id: string) {
  const session = await requirePermission("MANAGE_USERS");

  if (id === session.user.id) {
    return { success: false, error: "You cannot delete your own account" };
  }

  const user = await userRepository.findById(id);
  if (!user) return { success: false, error: "User not found" };

  if (user.roles.some((r) => r.role.name === "SUPER_ADMIN")) {
    const superAdminCount = await userRepository.countSuperAdmins();
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot delete the only Super Admin account" };
    }
  }

  await userRepository.delete(id);

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "User",
    entityId: id,
    details: `Deleted user ${user.name} (${user.email})`,
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
