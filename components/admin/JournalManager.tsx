"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Tag,
  FolderPlus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteJournalAction,
  toggleJournalPublishAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  createTagAction,
  deleteTagAction,
} from "@/lib/actions/journal.actions";

export function JournalManager({
  initialPosts,
  initialCategories,
  initialTags,
}: {
  initialPosts: any[];
  initialCategories: any[];
  initialTags: any[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Category & Tag Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<any | null>(null);

  // New category form
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  // New tag form
  const [newTagName, setNewTagName] = useState("");

  const [loading, setLoading] = useState(false);

  // Handlers
  const handleTogglePublish = async (post: any) => {
    const nextPublished = !post.published;
    try {
      const res = await toggleJournalPublishAction(post.id, nextPublished);
      if (res.success) {
        setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: nextPublished } : p)));
        toast.success(`Article ${nextPublished ? "published" : "set to draft"}`);
      }
    } catch {
      toast.error("Failed to update publication status");
    }
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    setLoading(true);
    try {
      const res = await deleteJournalAction(deletingPost.id);
      if (res.success) {
        setPosts(posts.filter((p) => p.id !== deletingPost.id));
        toast.success(`Article "${deletingPost.title}" deleted`);
        setDeletingPost(null);
      }
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCategoryAction({
        name: newCatName,
        slug: newCatSlug,
        description: newCatDesc,
      });
      if (res.success && res.category) {
        setCategories([...categories, res.category]);
        toast.success(`Category "${res.category.name}" created`);
        setNewCatName("");
        setNewCatSlug("");
        setNewCatDesc("");
      } else {
        toast.error(res.error || "Failed to create category");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories(categories.filter((c) => c.id !== id));
        toast.success("Category deleted");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createTagAction(newTagName);
      if (res.success && res.tag) {
        setTags([...tags.filter((t) => t.id !== res.tag.id), res.tag]);
        toast.success(`Tag "${res.tag.name}" created`);
        setNewTagName("");
      }
    } catch {
      toast.error("Failed to create tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const res = await deleteTagAction(id);
      if (res.success) {
        setTags(tags.filter((t) => t.id !== id));
        toast.success("Tag deleted");
      }
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || p.categoryId === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && p.published) ||
      (statusFilter === "DRAFT" && !p.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Journal & Blog CMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish origin stories, harvest news, cupping reports, and company updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted shadow-sm"
          >
            <FolderPlus className="h-4 w-4" />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setIsTagModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted shadow-sm"
          >
            <Tag className="h-4 w-4" />
            Tags ({tags.length})
          </button>
          <Link
            href="/admin/journal/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Write New Article
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">Article</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Author / Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="transition hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.coverImage?.url ? (
                        <img
                          src={post.coverImage.url}
                          alt={post.title}
                          className="h-12 w-16 rounded object-cover border border-border"
                        />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded bg-muted text-muted-foreground">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/admin/journal/${post.id}`}
                          className="font-semibold text-foreground hover:text-primary transition line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.category ? (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Published
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{post.author?.name || "Lambek Staff"}</p>
                    <p>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          title="View on Website"
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/journal/${post.id}`}
                        title="Edit Article"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingPost(post)}
                        title="Delete Article"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No journal posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">Manage Categories</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Create, edit, or remove article categories.
            </p>

            <form onSubmit={handleCreateCategory} className="mt-4 space-y-3 rounded-lg border border-border bg-muted/20 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Add New Category
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Category Name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Slug (optional)"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !newCatName}
                className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save Category
              </button>
            </form>

            <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(c.id, c.name)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Manager Modal */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">Manage Tags</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Add tags to categorize journal topics.
            </p>

            <form onSubmit={handleCreateTag} className="mt-4 flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Specialty, Harvest 2026, Cupping"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !newTagName}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add Tag
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 max-h-60 overflow-y-auto">
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
                >
                  #{t.name}
                  <button
                    onClick={() => handleDeleteTag(t.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsTagModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-serif text-xl font-bold">Delete Article</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deletingPost.title}</strong>? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingPost(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
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
