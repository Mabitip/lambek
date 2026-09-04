"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Coffee,
  Plus,
  Search,
  Star,
  CheckCircle2,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import {
  toggleCoffeePublishedAction,
  toggleCoffeeFeaturedAction,
  deleteCoffeeAction,
} from "@/lib/actions/catalog.actions";

export function CoffeesManager({
  initialCoffees,
  origins,
  processes,
}: {
  initialCoffees: any[];
  origins: any[];
  processes: any[];
}) {
  const [coffees, setCoffees] = useState(initialCoffees);
  const [search, setSearch] = useState("");
  const [originFilter, setOriginFilter] = useState("ALL");
  const [processFilter, setProcessFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [deletingCoffee, setDeletingCoffee] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTogglePublished = async (coffee: any) => {
    const nextPublished = !coffee.published;
    try {
      const res = await toggleCoffeePublishedAction(coffee.id, nextPublished);
      if (res.success) {
        setCoffees(coffees.map((c) => (c.id === coffee.id ? { ...c, published: nextPublished } : c)));
        toast.success(`Coffee ${nextPublished ? "published" : "hidden"}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (coffee: any) => {
    const nextFeatured = !coffee.featured;
    try {
      const res = await toggleCoffeeFeaturedAction(coffee.id, nextFeatured);
      if (res.success) {
        setCoffees(coffees.map((c) => (c.id === coffee.id ? { ...c, featured: nextFeatured } : c)));
        toast.success(`Coffee ${nextFeatured ? "marked as featured" : "unfeatured"}`);
      }
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const handleDelete = async () => {
    if (!deletingCoffee) return;
    setLoading(true);
    try {
      const res = await deleteCoffeeAction(deletingCoffee.id);
      if (res.success) {
        setCoffees(coffees.filter((c) => c.id !== deletingCoffee.id));
        toast.success(`Coffee "${deletingCoffee.name}" deleted`);
        setDeletingCoffee(null);
      } else {
        toast.error("Failed to delete coffee");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filtered = coffees.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.region?.toLowerCase().includes(search.toLowerCase());
    const matchesOrigin = originFilter === "ALL" || c.originId === originFilter;
    const matchesProcess = processFilter === "ALL" || c.processId === processFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && c.published) ||
      (statusFilter === "DRAFT" && !c.published) ||
      (statusFilter === "FEATURED" && c.featured);
    return matchesSearch && matchesOrigin && matchesProcess && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Coffee Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage green coffee lots, cupping profiles, origin specifications, and lot traceability.
          </p>
        </div>
        <Link
          href="/admin/coffees/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add New Coffee
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search coffee by name, origin region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Origins</option>
            {origins.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <select
            value={processFilter}
            onChange={(e) => setProcessFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Processes</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="FEATURED">Featured</option>
          </select>
        </div>
      </div>

      {/* Coffee Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">Coffee Details</th>
                <th className="px-6 py-3.5">Origin & Process</th>
                <th className="px-6 py-3.5">Cup Score / Profile</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((coffee) => {
                const primaryImage = coffee.images?.[0]?.media?.url;

                return (
                  <tr key={coffee.id} className="transition hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={coffee.name}
                            className="h-12 w-12 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Coffee className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/coffees/${coffee.id}`}
                              className="font-semibold text-foreground hover:text-primary transition"
                            >
                              {coffee.name}
                            </Link>
                            {coffee.featured && (
                              <button
                                onClick={() => handleToggleFeatured(coffee)}
                                title="Featured Coffee"
                                className="text-amber-500"
                              >
                                <Star className="h-4 w-4 fill-amber-500" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">/{coffee.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{coffee.origin?.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{coffee.process?.name || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {coffee.cupScore ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-bold text-secondary">
                          <Award className="h-3 w-3" /> {coffee.cupScore} pts
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unrated</span>
                      )}
                      {coffee.tastingNotes?.length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {coffee.tastingNotes.join(", ")}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublished(coffee)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                            coffee.published
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                          }`}
                        >
                          {coffee.published ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Published
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" /> Draft
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {coffee.published && (
                          <Link
                            href={`/coffee/${coffee.slug}`}
                            target="_blank"
                            title="View on Website"
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/coffees/${coffee.id}`}
                          title="Edit Coffee"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeletingCoffee(coffee)}
                          title="Delete Coffee"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No coffees found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCoffee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-serif text-xl font-bold">Delete Coffee</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deletingCoffee.name}</strong>? This will remove all associated profile data and lots.
            </p>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingCoffee(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
