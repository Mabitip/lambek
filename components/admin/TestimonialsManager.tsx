"use client";

import { useState } from "react";
import {
  MessageSquareQuote,
  Handshake,
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
} from "@/lib/actions/catalog.actions";

export function TestimonialsManager({
  initialTestimonials,
  initialPartners,
}: {
  initialTestimonials: any[];
  initialPartners: any[];
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [partners, setPartners] = useState(initialPartners);

  // Modals
  const [testModal, setTestModal] = useState<{ isOpen: boolean; data?: any }>({ isOpen: false });
  const [partnerModal, setPartnerModal] = useState<{ isOpen: boolean; data?: any }>({ isOpen: false });
  const [deletingItem, setDeletingItem] = useState<{ type: "testimonial" | "partner"; id: string; name: string } | null>(null);

  // Forms
  const [testForm, setTestForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    featured: false,
    published: true,
    sortOrder: 0,
  });

  const [partnerForm, setPartnerForm] = useState({
    name: "",
    logoUrl: "",
    website: "",
    sortOrder: 0,
    published: true,
  });

  const [loading, setLoading] = useState(false);

  // --- Testimonial Handlers ---
  const handleOpenTestModal = (item?: any) => {
    if (item) {
      setTestForm({
        name: item.name,
        role: item.role || "",
        company: item.company || "",
        content: item.content,
        featured: item.featured,
        published: item.published,
        sortOrder: item.sortOrder || 0,
      });
      setTestModal({ isOpen: true, data: item });
    } else {
      setTestForm({
        name: "",
        role: "",
        company: "",
        content: "",
        featured: false,
        published: true,
        sortOrder: 0,
      });
      setTestModal({ isOpen: true });
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (testModal.data) {
        const res = await updateTestimonialAction(testModal.data.id, testForm);
        if (res.success && res.testimonial) {
          setTestimonials(testimonials.map((t) => (t.id === testModal.data.id ? res.testimonial : t)));
          toast.success("Testimonial updated");
          setTestModal({ isOpen: false });
        } else {
          toast.error("Failed to update testimonial");
        }
      } else {
        const res = await createTestimonialAction(testForm);
        if (res.success && res.testimonial) {
          setTestimonials([...testimonials, res.testimonial]);
          toast.success("Testimonial created");
          setTestModal({ isOpen: false });
        } else {
          toast.error("Failed to create testimonial");
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // --- Partner Handlers ---
  const handleOpenPartnerModal = (item?: any) => {
    if (item) {
      setPartnerForm({
        name: item.name,
        logoUrl: item.logoUrl || "",
        website: item.website || "",
        sortOrder: item.sortOrder || 0,
        published: item.published,
      });
      setPartnerModal({ isOpen: true, data: item });
    } else {
      setPartnerForm({
        name: "",
        logoUrl: "",
        website: "",
        sortOrder: 0,
        published: true,
      });
      setPartnerModal({ isOpen: true });
    }
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (partnerModal.data) {
        const res = await updatePartnerAction(partnerModal.data.id, partnerForm);
        if (res.success && res.partner) {
          setPartners(partners.map((p) => (p.id === partnerModal.data.id ? res.partner : p)));
          toast.success("Partner updated");
          setPartnerModal({ isOpen: false });
        } else {
          toast.error("Failed to update partner");
        }
      } else {
        const res = await createPartnerAction(partnerForm);
        if (res.success && res.partner) {
          setPartners([...partners, res.partner]);
          toast.success("Partner added");
          setPartnerModal({ isOpen: false });
        } else {
          toast.error("Failed to create partner");
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
      if (deletingItem.type === "testimonial") {
        const res = await deleteTestimonialAction(deletingItem.id);
        if (res.success) {
          setTestimonials(testimonials.filter((t) => t.id !== deletingItem.id));
          toast.success("Testimonial deleted");
        }
      } else {
        const res = await deletePartnerAction(deletingItem.id);
        if (res.success) {
          setPartners(partners.filter((p) => p.id !== deletingItem.id));
          toast.success("Partner deleted");
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
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Testimonials & Roaster Partners</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage buyer testimonials, roaster endorsements, and global partner logos.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Testimonials */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                Testimonials ({testimonials.length})
              </h2>
            </div>
            <button
              onClick={() => handleOpenTestModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Testimonial
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="rounded-lg border border-border bg-background p-4 transition hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{test.name}</h3>
                      {test.featured && (
                        <span className="flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                          <Star className="h-3 w-3 fill-amber-500" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {test.role ? `${test.role}, ` : ""}
                      {test.company}
                    </p>
                    <p className="mt-2 text-xs text-foreground/80 italic">"{test.content}"</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenTestModal(test)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({ type: "testimonial", id: test.id, name: test.name })
                      }
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground">No testimonials yet.</p>
            )}
          </div>
        </div>

        {/* Partners */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-secondary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                Partners ({partners.length})
              </h2>
            </div>
            <button
              onClick={() => handleOpenPartnerModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Partner
            </button>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="rounded-lg border border-border bg-background p-4 transition hover:border-secondary/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="h-10 w-10 object-contain rounded border border-border p-1 bg-white"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{partner.name}</h3>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          {partner.website} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenPartnerModal(partner)}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({ type: "partner", id: partner.id, name: partner.name })
                      }
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {partners.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground">No partners added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Testimonial Modal */}
      {testModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {testModal.data ? `Edit Testimonial: ${testModal.data.name}` : "Add Testimonial"}
            </h2>

            <form onSubmit={handleSaveTestimonial} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={testForm.name}
                    onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="e.g. Marc Vance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={testForm.role}
                    onChange={(e) => setTestForm({ ...testForm, role: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="Head Roaster"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Company / Roastery
                </label>
                <input
                  type="text"
                  value={testForm.company}
                  onChange={(e) => setTestForm({ ...testForm, company: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="Apex Specialty Coffee Co."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Testimonial Quote
                </label>
                <textarea
                  rows={4}
                  required
                  value={testForm.content}
                  onChange={(e) => setTestForm({ ...testForm, content: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none"
                  placeholder="The cup clarity and floral aroma from Lambek's Gedeo washed lots are truly outstanding..."
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testForm.featured}
                    onChange={(e) => setTestForm({ ...testForm, featured: e.target.checked })}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  Featured Testimonial
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testForm.published}
                    onChange={(e) => setTestForm({ ...testForm, published: e.target.checked })}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  Published
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setTestModal({ isOpen: false })}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !testForm.name || !testForm.content}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {partnerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {partnerModal.data ? `Edit Partner: ${partnerModal.data.name}` : "Add Partner"}
            </h2>

            <form onSubmit={handleSavePartner} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Partner Name
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="e.g. Nordic Roasting Lab"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={partnerForm.logoUrl}
                  onChange={(e) => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">
                  Website URL
                </label>
                <input
                  type="url"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPartnerModal({ isOpen: false })}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !partnerForm.name}
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Partner
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
              <h2 className="font-serif text-xl font-bold">Delete Item</h2>
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
