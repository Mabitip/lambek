"use client";

import { useState } from "react";
import {
  MapPin,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  createOriginAction,
  updateOriginAction,
  deleteOriginAction,
  createProcessAction,
  updateProcessAction,
  deleteProcessAction,
} from "@/lib/actions/catalog.actions";

export function OriginsProcessesManager({
  initialOrigins,
  initialProcesses,
}: {
  initialOrigins: any[];
  initialProcesses: any[];
}) {
  const [origins, setOrigins] = useState(initialOrigins);
  const [processes, setProcesses] = useState(initialProcesses);

  // Modals
  const [originModal, setOriginModal] = useState<{ isOpen: boolean; data?: any }>({ isOpen: false });
  const [processModal, setProcessModal] = useState<{ isOpen: boolean; data?: any }>({ isOpen: false });
  const [deletingItem, setDeletingItem] = useState<{ type: "origin" | "process"; id: string; name: string } | null>(null);

  // Form states
  const [originForm, setOriginForm] = useState({
    name: "",
    slug: "",
    country: "Ethiopia",
    region: "",
    zone: "",
    elevation: "",
    description: "",
  });

  const [processForm, setProcessForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // --- Origins Handlers ---
  const handleOpenOriginModal = (origin?: any) => {
    if (origin) {
      setOriginForm({
        name: origin.name,
        slug: origin.slug,
        country: origin.country || "Ethiopia",
        region: origin.region || "",
        zone: origin.zone || "",
        elevation: origin.elevation || "",
        description: origin.description || "",
      });
      setOriginModal({ isOpen: true, data: origin });
    } else {
      setOriginForm({
        name: "",
        slug: "",
        country: "Ethiopia",
        region: "",
        zone: "",
        elevation: "",
        description: "",
      });
      setOriginModal({ isOpen: true });
    }
  };

  const handleSaveOrigin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (originModal.data) {
        const res = await updateOriginAction(originModal.data.id, originForm);
        if (res.success && "origin" in res && res.origin) {
          setOrigins(origins.map((o) => (o.id === originModal.data.id ? res.origin : o)));
          toast.success(`Origin "${res.origin.name}" updated`);
          setOriginModal({ isOpen: false });
        } else {
          toast.error(String("error" in res && res.error ? res.error : "Failed to update origin"));
        }
      } else {
        const res = await createOriginAction(originForm);
        if (res.success && "origin" in res && res.origin) {
          setOrigins([...origins, res.origin]);
          toast.success(`Origin "${res.origin.name}" created`);
          setOriginModal({ isOpen: false });
        } else {
          toast.error(String("error" in res && res.error ? res.error : "Failed to create origin"));
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // --- Processes Handlers ---
  const handleOpenProcessModal = (proc?: any) => {
    if (proc) {
      setProcessForm({
        name: proc.name,
        slug: proc.slug,
        description: proc.description || "",
      });
      setProcessModal({ isOpen: true, data: proc });
    } else {
      setProcessForm({
        name: "",
        slug: "",
        description: "",
      });
      setProcessModal({ isOpen: true });
    }
  };

  const handleSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (processModal.data) {
        const res = await updateProcessAction(processModal.data.id, processForm);
        if (res.success && "process" in res && res.process) {
          setProcesses(processes.map((p) => (p.id === processModal.data.id ? res.process : p)));
          toast.success(`Process "${res.process.name}" updated`);
          setProcessModal({ isOpen: false });
        } else {
          toast.error(String("error" in res && res.error ? res.error : "Failed to update process"));
        }
      } else {
        const res = await createProcessAction(processForm);
        if (res.success && "process" in res && res.process) {
          setProcesses([...processes, res.process]);
          toast.success(`Process "${res.process.name}" created`);
          setProcessModal({ isOpen: false });
        } else {
          toast.error(String("error" in res && res.error ? res.error : "Failed to create process"));
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      if (deletingItem.type === "origin") {
        const res = await deleteOriginAction(deletingItem.id);
        if (res.success) {
          setOrigins(origins.filter((o) => o.id !== deletingItem.id));
          toast.success("Origin deleted");
        }
      } else {
        const res = await deleteProcessAction(deletingItem.id);
        if (res.success) {
          setProcesses(processes.filter((p) => p.id !== deletingItem.id));
          toast.success("Process deleted");
        }
      }
      setDeletingItem(null);
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Origins & Processing Methods</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage coffee terroir origins and processing techniques.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Origins Section */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                Origins ({origins.length})
              </h2>
            </div>
            <button
              onClick={() => handleOpenOriginModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Origin
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {origins.map((origin) => (
              <div
                key={origin.id}
                className="rounded-lg border border-border bg-background p-4 transition hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{origin.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {origin.country} {origin.zone ? `· ${origin.zone}` : ""} {origin.region ? `· ${origin.region}` : ""}
                    </p>
                    {origin.elevation && (
                      <p className="text-xs text-primary font-medium mt-1">⛰️ {origin.elevation}</p>
                    )}
                    {origin.description && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{origin.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenOriginModal(origin)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({ type: "origin", id: origin.id, name: origin.name })
                      }
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {origins.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground">No origins added yet.</p>
            )}
          </div>
        </div>

        {/* Processing Methods Section */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-secondary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                Processes ({processes.length})
              </h2>
            </div>
            <button
              onClick={() => handleOpenProcessModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Process
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {processes.map((proc) => (
              <div
                key={proc.id}
                className="rounded-lg border border-border bg-background p-4 transition hover:border-secondary/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{proc.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">/{proc.slug}</p>
                    {proc.description && (
                      <p className="mt-2 text-xs text-muted-foreground">{proc.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenProcessModal(proc)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({ type: "process", id: proc.id, name: proc.name })
                      }
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {processes.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground">No processes added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Origin Modal */}
      {originModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {originModal.data ? `Edit Origin: ${originModal.data.name}` : "Add New Origin"}
            </h2>

            <form onSubmit={handleSaveOrigin} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Origin Name
                  </label>
                  <input
                    type="text"
                    required
                    value={originForm.name}
                    onChange={(e) => setOriginForm({ ...originForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="e.g. Yirgacheffe / Gedeo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Slug (optional)
                  </label>
                  <input
                    type="text"
                    value={originForm.slug}
                    onChange={(e) => setOriginForm({ ...originForm, slug: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="yirgacheffe-gedeo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Country
                  </label>
                  <input
                    type="text"
                    value={originForm.country}
                    onChange={(e) => setOriginForm({ ...originForm, country: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Zone
                  </label>
                  <input
                    type="text"
                    value={originForm.zone}
                    onChange={(e) => setOriginForm({ ...originForm, zone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="Gedeo Zone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Region
                  </label>
                  <input
                    type="text"
                    value={originForm.region}
                    onChange={(e) => setOriginForm({ ...originForm, region: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="Southern Highlands"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Elevation
                  </label>
                  <input
                    type="text"
                    value={originForm.elevation}
                    onChange={(e) => setOriginForm({ ...originForm, elevation: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="1,900 – 2,200 MASL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={originForm.description}
                  onChange={(e) => setOriginForm({ ...originForm, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none"
                  placeholder="Terroir details, climate, soil composition..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setOriginModal({ isOpen: false })}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !originForm.name}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Origin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Modal */}
      {processModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {processModal.data ? `Edit Process: ${processModal.data.name}` : "Add New Process"}
            </h2>

            <form onSubmit={handleSaveProcess} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Process Name
                </label>
                <input
                  type="text"
                  required
                  value={processForm.name}
                  onChange={(e) => setProcessForm({ ...processForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="e.g. Anaerobic Natural"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Slug (optional)
                </label>
                <input
                  type="text"
                  value={processForm.slug}
                  onChange={(e) => setProcessForm({ ...processForm, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="anaerobic-natural"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={processForm.description}
                  onChange={(e) => setProcessForm({ ...processForm, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none"
                  placeholder="Method explanation, drying beds, fermentation duration..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setProcessModal({ isOpen: false })}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !processForm.name}
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-serif text-xl font-bold">Delete {deletingItem.type}</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deletingItem.name}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
