"use client";

import { useState } from "react";
import {
  UserPlus,
  Search,
  Shield,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  createUserAction,
  updateUserAction,
  toggleUserActiveAction,
  resetUserPasswordAction,
  deleteUserAction,
} from "@/lib/actions/user.actions";
import type { RoleType } from "@prisma/client";

type UserWithRoles = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date | string;
  roles: { role: { id: string; name: RoleType } }[];
  _count?: { journalPosts: number; activityLogs: number };
};

const ALL_ROLES: { name: RoleType; label: string; desc: string }[] = [
  { name: "SUPER_ADMIN", label: "Super Admin", desc: "Full access to all system modules and user management" },
  { name: "ADMIN", label: "Admin", desc: "Full access to content, coffees, and inquiries (except user administration)" },
  { name: "EDITOR", label: "Editor", desc: "Can manage coffees, journal articles, and media" },
  { name: "SALES", label: "Sales Rep", desc: "Can view and manage inquiries and sample requests" },
];

export function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserWithRoles[];
  currentUserId?: string;
}) {
  const [users, setUsers] = useState<UserWithRoles[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [resettingUser, setResettingUser] = useState<UserWithRoles | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserWithRoles | null>(null);

  // Form states
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    roleNames: RoleType[];
    active: boolean;
  }>({
    name: "",
    email: "",
    password: "",
    roleNames: ["EDITOR"],
    active: true,
  });
  const [newPassword, setNewPassword] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "ALL" || u.roles.some((r) => r.role.name === roleFilter);
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      roleNames: ["EDITOR"],
      active: true,
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (user: UserWithRoles) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      roleNames: user.roles.map((r) => r.role.name),
      active: user.active,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUserAction(formData);
      if (res.success && res.user) {
        setUsers([res.user as UserWithRoles, ...users]);
        toast.success(`User "${res.user.name}" created successfully`);
        setIsAddOpen(false);
      } else {
        toast.error(res.error || "Failed to create user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    try {
      const res = await updateUserAction(editingUser.id, {
        name: formData.name,
        email: formData.email,
        roleNames: formData.roleNames,
        active: formData.active,
      });
      if (res.success && res.user) {
        setUsers(users.map((u) => (u.id === editingUser.id ? (res.user as UserWithRoles) : u)));
        toast.success(`User "${res.user.name}" updated successfully`);
        setEditingUser(null);
      } else {
        toast.error(res.error || "Failed to update user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user: UserWithRoles) => {
    const newActive = !user.active;
    try {
      const res = await toggleUserActiveAction(user.id, newActive);
      if (res.success) {
        setUsers(users.map((u) => (u.id === user.id ? { ...u, active: newActive } : u)));
        toast.success(`User ${newActive ? "activated" : "deactivated"}`);
      } else {
        toast.error(res.error || "Failed to change user status");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    setLoading(true);
    try {
      const res = await resetUserPasswordAction(resettingUser.id, newPassword);
      if (res.success) {
        toast.success(`Password for ${resettingUser.name} reset successfully`);
        setResettingUser(null);
        setNewPassword("");
      } else {
        toast.error(res.error || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setLoading(true);
    try {
      const res = await deleteUserAction(deletingUser.id);
      if (res.success) {
        setUsers(users.filter((u) => u.id !== deletingUser.id));
        toast.success(`User "${deletingUser.name}" deleted successfully`);
        setDeletingUser(null);
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleSelection = (role: RoleType) => {
    setFormData((prev) => {
      const exists = prev.roleNames.includes(role);
      if (exists) {
        return { ...prev, roleNames: prev.roleNames.filter((r) => r !== role) };
      } else {
        return { ...prev, roleNames: [...prev.roleNames, role] };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage system administrators, roles, permissions, and account access.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="SALES">Sales</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Roles</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const isCurrent = user.id === currentUserId;
                const isSuperAdmin = user.roles.some((r) => r.role.name === "SUPER_ADMIN");

                return (
                  <tr key={user.id} className="transition hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">{user.name}</p>
                            {isCurrent && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <span
                            key={r.role.name}
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                              r.role.name === "SUPER_ADMIN"
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                : r.role.name === "ADMIN"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                : r.role.name === "EDITOR"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            <Shield className="h-3 w-3" />
                            {r.role.name.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(user)}
                        disabled={isCurrent}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          user.active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                        } ${isCurrent ? "cursor-default opacity-80" : "cursor-pointer"}`}
                      >
                        {user.active ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Edit User"
                          className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setResettingUser(user)}
                          title="Reset Password"
                          className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        {!isCurrent && (
                          <button
                            onClick={() => setDeletingUser(user)}
                            title="Delete User"
                            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {(isAddOpen || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {isAddOpen ? "Add New Administrator" : `Edit User: ${editingUser?.name}`}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Assign roles and set account credentials.
            </p>

            <form onSubmit={isAddOpen ? handleCreateUser : handleUpdateUser} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>

              {isAddOpen && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Min 8 characters"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Assigned Roles
                </label>
                <div className="space-y-2">
                  {ALL_ROLES.map((r) => {
                    const isSelected = formData.roleNames.includes(r.name);
                    return (
                      <div
                        key={r.name}
                        onClick={() => toggleRoleSelection(r.name)}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
                          isSelected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-background/50 text-muted-foreground hover:bg-muted/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <label htmlFor="activeCheck" className="text-sm font-medium text-foreground cursor-pointer">
                  Account is active
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingUser(null);
                  }}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.roleNames.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isAddOpen ? "Create User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Reset Password for {resettingUser.name}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter a new secure password for {resettingUser.email}.
            </p>

            <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Min 8 characters"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || newPassword.length < 8}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-serif text-xl font-bold">Delete Administrator Account</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to permanently delete <strong>{deletingUser.name}</strong> ({deletingUser.email})? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
