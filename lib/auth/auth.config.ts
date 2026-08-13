import type { NextAuthConfig } from "next-auth";
import type { PermissionName } from "@/lib/constants/brand";

export type AppPermission = string;

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: AppPermission[];
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: AppPermission[];
  }
}

/** Edge-compatible Auth.js config (no Prisma / bcrypt / Node modules). */
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [],
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
        session.user.permissions = (token.permissions as AppPermission[]) ?? [];
      }
      return session;
    },
  },
};

export function hasPermission(
  permissions: AppPermission[] | undefined,
  required: PermissionName,
): boolean {
  return permissions?.includes(required) ?? false;
}

export function hasAnyRole(roles: string[] | undefined, required: string[]): boolean {
  return required.some((r) => roles?.includes(r));
}
