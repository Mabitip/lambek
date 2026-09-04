import { prisma } from "@/lib/db/prisma";
import type { RoleType } from "@prisma/client";

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        _count: {
          select: {
            journalPosts: true,
            activityLogs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  },

  async getAllRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  async create(data: {
    email: string;
    name: string;
    passwordHash: string;
    roleNames: RoleType[];
    active?: boolean;
  }) {
    const roles = await prisma.role.findMany({
      where: { name: { in: data.roleNames } },
    });

    return prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
        passwordHash: data.passwordHash,
        active: data.active ?? true,
        roles: {
          create: roles.map((r) => ({
            roleId: r.id,
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      roleNames?: RoleType[];
      active?: boolean;
      passwordHash?: string;
    }
  ) {
    // If roleNames specified, replace user roles
    if (data.roleNames) {
      const roles = await prisma.role.findMany({
        where: { name: { in: data.roleNames } },
      });

      // Delete existing roles and create new ones
      await prisma.userRole.deleteMany({
        where: { userId: id },
      });

      await prisma.userRole.createMany({
        data: roles.map((r) => ({
          userId: id,
          roleId: r.id,
        })),
      });
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.email && { email: data.email.toLowerCase().trim() }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.passwordHash && { passwordHash: data.passwordHash }),
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  },

  async delete(id: string) {
    // Cascade delete roles, logs, and unassign journal posts
    return prisma.user.delete({
      where: { id },
    });
  },

  async countSuperAdmins() {
    return prisma.userRole.count({
      where: {
        role: { name: "SUPER_ADMIN" },
        user: { active: true },
      },
    });
  },
};
