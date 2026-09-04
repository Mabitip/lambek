"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { uploadMediaAction, deleteMediaAction } from "@/lib/actions/media.actions";

export function MediaManager({
  initialMedia,
}: {
  initialMedia: any[];
}) {
  const [mediaList, setMediaList] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Upload Form
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadFilename, setUploadFilename] = useState("");
  const [uploadAltText, setUploadAltText] = useState("");

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl || !uploadFilename) return;

    setLoading(true);
    try {
      const res = await uploadMediaAction({
        filename: uploadFilename,
        originalName: uploadFilename,
        mimeType: "image/jpeg",
        size: 1024,
        url: uploadUrl,
        altText: uploadAltText,
      });

      if (res.success && res.media) {
        setMediaList([res.media, ...mediaList]);
        toast.success(`Media "${uploadFilename}" added successfully`);
        setUploadUrl("");
        setUploadFilename("");
        setUploadAltText("");
        setIsUploadOpen(false);
      } else {
        toast.error("Failed to add media");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMedia) return;
    setLoading(true);
    try {
      const res = await deleteMediaAction(deletingMedia.id);
      if (res.success) {
        setMediaList(mediaList.filter((m) => m.id !== deletingMedia.id));
        toast.success("Media deleted");
        setDeletingMedia(null);
      } else {
        toast.error("Failed to delete media");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.altText?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Media Assets Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage imagery for coffee origins, processing mills, journal articles, and brand hero assets.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
          Add Media Asset
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search media by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:border-primary hover:shadow-md"
          >
            <div className="aspect-square w-full overflow-hidden bg-muted/40">
              <img
                src={item.url}
                alt={item.altText || item.filename}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-semibold text-foreground">{item.filename}</p>
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Hover Actions overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="rounded-lg bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40"
                title="Copy Public URL"
              >
                {copiedId === item.id ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40"
                title="View Full Size"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => setDeletingMedia(item)}
                className="rounded-lg bg-destructive/80 p-2 text-white hover:bg-destructive"
                title="Delete Media"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">No media assets found.</p>
      )}

      {/* Add Media Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">Add Media Asset</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Register a public image asset or CDN URL into the media library.
            </p>

            <form onSubmit={handleUpload} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Asset Title / Filename
                </label>
                <input
                  type="text"
                  required
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="e.g. gedeo_harvest_elevation.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              {uploadUrl && (
                <div className="rounded-lg border border-border p-2 bg-muted/20">
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                    Preview
                  </p>
                  <img
                    src={uploadUrl}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded"
                    onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Alt Description
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="Accessible description of the photo..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !uploadUrl || !uploadFilename}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Register Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-serif text-xl font-bold">Delete Media Asset</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deletingMedia.filename}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingMedia(null)}
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
                Delete Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
