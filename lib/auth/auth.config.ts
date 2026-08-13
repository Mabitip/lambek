import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import type { PermissionName } from "@/lib/constants/brand";
import type { PermissionType } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: PermissionType[];
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: PermissionType[];
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: { permission: true },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.active) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );
        if (!valid) return null;

        const roles = user.roles.map((ur) => ur.role.name);
        const permissions = [
          ...new Set(
            user.roles.flatMap((ur) =>
              ur.role.permissions.map((rp) => rp.permission.name),
            ),
          ),
        ];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.roles = user.roles ?? [];
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as PermissionType[]) ?? [];
      }
      return session;
    },
  },
};

export function hasPermission(
  permissions: PermissionType[] | undefined,
  required: PermissionName,
): boolean {
  return permissions?.includes(required as PermissionType) ?? false;
}

export function hasAnyRole(roles: string[] | undefined, required: string[]): boolean {
  return required.some((r) => roles?.includes(r));
}
