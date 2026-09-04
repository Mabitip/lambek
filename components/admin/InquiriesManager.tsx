"use client";

import { useState } from "react";
import {
  Mail,
  Package,
  Coffee,
  UserCheck,
  Search,
  CheckCircle,
  Eye,
  Trash2,
  ExternalLink,
  Plus,
  Download,
  Loader2,
  AlertTriangle,
  Clock,
  Send,
  Building,
  Phone,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import {
  toggleMessageReadAction,
  deleteMessageAction,
  toggleInquiryReadAction,
  deleteInquiryAction,
  updateSampleRequestStatusAction,
  deleteSampleRequestAction,
  addSubscriberAction,
  toggleSubscriberActiveAction,
  deleteSubscriberAction,
} from "@/lib/actions/inquiry.actions";
import type { SampleRequestStatus, InquiryType } from "@prisma/client";

const SAMPLE_STATUSES: { value: SampleRequestStatus; label: string; color: string }[] = [
  { value: "PENDING", label: "Pending Review", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { value: "CONTACTED", label: "Contacted", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { value: "APPROVED", label: "Approved", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { value: "SHIPPED", label: "Shipped", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { value: "COMPLETED", label: "Completed", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
  { value: "REJECTED", label: "Rejected", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
];

export function InquiriesManager({
  initialContactMessages,
  initialInquiries,
  initialSampleRequests,
  initialSubscribers,
}: {
  initialContactMessages: any[];
  initialInquiries: any[];
  initialSampleRequests: any[];
  initialSubscribers: any[];
}) {
  const [activeTab, setActiveTab] = useState<"messages" | "inquiries" | "samples" | "subscribers">("messages");

  // State data
  const [messages, setMessages] = useState(initialContactMessages);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [samples, setSamples] = useState(initialSampleRequests);
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  // Search & filter
  const [search, setSearch] = useState("");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [sampleStatusFilter, setSampleStatusFilter] = useState<string>("ALL");

  // Modals
  const [viewingItem, setViewingItem] = useState<{ type: string; data: any } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: string; id: string; title: string } | null>(null);
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [sampleNotesEdit, setSampleNotesEdit] = useState<{ id: string; notes: string } | null>(null);

  const [loading, setLoading] = useState(false);

  // Counts
  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  const unreadInquiriesCount = inquiries.filter((i) => !i.read).length;
  const pendingSamplesCount = samples.filter((s) => s.status === "PENDING").length;

  // --- Handlers for Contact Messages ---
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await toggleMessageReadAction(id, !currentRead);
      if (res.success) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read: !currentRead } : m)));
        if (viewingItem?.data.id === id) {
          setViewingItem({ ...viewingItem, data: { ...viewingItem.data, read: !currentRead } });
        }
        toast.success(`Message marked as ${!currentRead ? "read" : "unread"}`);
      }
    } catch {
      toast.error("Failed to update message status");
    }
  };

  const handleDeleteMessage = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      const res = await deleteMessageAction(deletingItem.id);
      if (res.success) {
        setMessages(messages.filter((m) => m.id !== deletingItem.id));
        toast.success("Contact message deleted");
        setDeletingItem(null);
        if (viewingItem?.data.id === deletingItem.id) setViewingItem(null);
      }
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for Trade Inquiries ---
  const handleToggleInquiryRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await toggleInquiryReadAction(id, !currentRead);
      if (res.success) {
        setInquiries(inquiries.map((i) => (i.id === id ? { ...i, read: !currentRead } : i)));
        if (viewingItem?.data.id === id) {
          setViewingItem({ ...viewingItem, data: { ...viewingItem.data, read: !currentRead } });
        }
        toast.success(`Inquiry marked as ${!currentRead ? "read" : "unread"}`);
      }
    } catch {
      toast.error("Failed to update inquiry status");
    }
  };

  const handleDeleteInquiry = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      const res = await deleteInquiryAction(deletingItem.id);
      if (res.success) {
        setInquiries(inquiries.filter((i) => i.id !== deletingItem.id));
        toast.success("Inquiry deleted");
        setDeletingItem(null);
        if (viewingItem?.data.id === deletingItem.id) setViewingItem(null);
      }
    } catch {
      toast.error("Failed to delete inquiry");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for Sample Requests ---
  const handleUpdateSampleStatus = async (id: string, newStatus: SampleRequestStatus) => {
    try {
      const res = await updateSampleRequestStatusAction(id, newStatus);
      if (res.success) {
        setSamples(samples.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
        toast.success(`Sample request status updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update sample status");
    }
  };

  const handleSaveSampleNotes = async () => {
    if (!sampleNotesEdit) return;
    setLoading(true);
    try {
      const sample = samples.find((s) => s.id === sampleNotesEdit.id);
      if (!sample) return;
      const res = await updateSampleRequestStatusAction(
        sampleNotesEdit.id,
        sample.status,
        sampleNotesEdit.notes
      );
      if (res.success) {
        setSamples(
          samples.map((s) =>
            s.id === sampleNotesEdit.id ? { ...s, adminNotes: sampleNotesEdit.notes } : s
          )
        );
        toast.success("Admin notes saved");
        setSampleNotesEdit(null);
      }
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSample = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      const res = await deleteSampleRequestAction(deletingItem.id);
      if (res.success) {
        setSamples(samples.filter((s) => s.id !== deletingItem.id));
        toast.success("Sample request deleted");
        setDeletingItem(null);
        if (viewingItem?.data.id === deletingItem.id) setViewingItem(null);
      }
    } catch {
      toast.error("Failed to delete sample request");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for Subscribers ---
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addSubscriberAction(newSubscriberEmail);
      if (res.success && res.subscriber) {
        setSubscribers([
          res.subscriber,
          ...subscribers.filter((s) => s.id !== res.subscriber.id),
        ]);
        toast.success(`Subscriber "${newSubscriberEmail}" added`);
        setNewSubscriberEmail("");
        setIsAddSubscriberOpen(false);
      } else {
        toast.error(res.error || "Failed to add subscriber");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscriber = async (id: string, currentActive: boolean) => {
    try {
      const res = await toggleSubscriberActiveAction(id, !currentActive);
      if (res.success) {
        setSubscribers(
          subscribers.map((s) => (s.id === id ? { ...s, active: !currentActive } : s))
        );
        toast.success(`Subscriber ${!currentActive ? "activated" : "deactivated"}`);
      }
    } catch {
      toast.error("Failed to update subscriber");
    }
  };

  const handleDeleteSubscriber = async () => {
    if (!deletingItem) return;
    setLoading(true);
    try {
      const res = await deleteSubscriberAction(deletingItem.id);
      if (res.success) {
        setSubscribers(subscribers.filter((s) => s.id !== deletingItem.id));
        toast.success("Subscriber removed");
        setDeletingItem(null);
      }
    } catch {
      toast.error("Failed to delete subscriber");
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribersCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Email,Status,Subscribed Date"]
        .concat(
          subscribers.map(
            (s) =>
              `"${s.email}","${s.active ? "Active" : "Inactive"}","${new Date(
                s.createdAt
              ).toLocaleDateString()}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Contacts & Inquiries Control Center
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage inbound trade inquiries, customer contact messages, green coffee sample orders, and newsletter subscribers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-2">
        <button
          onClick={() => {
            setActiveTab("messages");
            setSearch("");
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "messages"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>Contact Messages</span>
          {unreadMessagesCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("inquiries");
            setSearch("");
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "inquiries"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Coffee className="h-4 w-4" />
          <span>Trade Inquiries</span>
          {unreadInquiriesCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {unreadInquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("samples");
            setSearch("");
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "samples"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Sample Requests</span>
          {pendingSamplesCount > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {pendingSamplesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("subscribers");
            setSearch("");
          }}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "subscribers"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Newsletter Subscribers</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {subscribers.length}
          </span>
        </button>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search in ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {(activeTab === "messages" || activeTab === "inquiries") && (
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={filterUnreadOnly}
                onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              Show Unread Only
            </label>
          )}

          {activeTab === "samples" && (
            <select
              value={sampleStatusFilter}
              onChange={(e) => setSampleStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              {SAMPLE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )}

          {activeTab === "subscribers" && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportSubscribersCSV}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => setIsAddSubscriberOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Subscriber
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: CONTACT MESSAGES */}
      {activeTab === "messages" && (
        <div className="space-y-3">
          {messages
            .filter((m) => {
              const matchesSearch =
                m.name?.toLowerCase().includes(search.toLowerCase()) ||
                m.email?.toLowerCase().includes(search.toLowerCase()) ||
                m.subject?.toLowerCase().includes(search.toLowerCase()) ||
                m.message?.toLowerCase().includes(search.toLowerCase());
              const matchesUnread = !filterUnreadOnly || !m.read;
              return matchesSearch && matchesUnread;
            })
            .map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl border p-5 transition ${
                  msg.read
                    ? "border-border bg-card hover:border-primary/30"
                    : "border-primary/40 bg-primary/5 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{msg.name}</p>
                      <span className="text-xs text-muted-foreground">&lt;{msg.email}&gt;</span>
                      {!msg.read && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                          New
                        </span>
                      )}
                    </div>
                    {msg.subject && (
                      <p className="mt-1 text-sm font-medium text-foreground">{msg.subject}</p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{msg.message}</p>
                    <p className="mt-3 text-xs text-muted-foreground/70">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingItem({ type: "message", data: msg })}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                      title={msg.read ? "Mark as Unread" : "Mark as Read"}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <CheckCircle className={`h-4 w-4 ${msg.read ? "text-emerald-500" : ""}`} />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({ type: "message", id: msg.id, title: `Message from ${msg.name}` })
                      }
                      title="Delete"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {messages.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No contact messages received yet.</p>
          )}
        </div>
      )}

      {/* TAB 2: TRADE INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="space-y-3">
          {inquiries
            .filter((inq) => {
              const matchesSearch =
                inq.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                inq.email?.toLowerCase().includes(search.toLowerCase()) ||
                inq.company?.toLowerCase().includes(search.toLowerCase()) ||
                inq.message?.toLowerCase().includes(search.toLowerCase());
              const matchesUnread = !filterUnreadOnly || !inq.read;
              return matchesSearch && matchesUnread;
            })
            .map((inq) => (
              <div
                key={inq.id}
                className={`rounded-xl border p-5 transition ${
                  inq.read
                    ? "border-border bg-card hover:border-primary/30"
                    : "border-primary/40 bg-primary/5 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{inq.fullName}</p>
                      {inq.company && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {inq.company}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">&lt;{inq.email}&gt;</span>
                      <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-[10px] font-bold text-secondary uppercase tracking-wider">
                        {inq.requestType?.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {inq.coffee?.name && (
                        <span className="font-medium text-primary">☕ {inq.coffee.name}</span>
                      )}
                      {inq.country && <span>📍 {inq.country}</span>}
                      {inq.estimatedQuantity && <span>📦 {inq.estimatedQuantity}</span>}
                    </div>

                    {inq.message && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{inq.message}</p>
                    )}

                    <p className="mt-3 text-xs text-muted-foreground/70">
                      {new Date(inq.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingItem({ type: "inquiry", data: inq })}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleToggleInquiryRead(inq.id, inq.read)}
                      title={inq.read ? "Mark as Unread" : "Mark as Read"}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <CheckCircle className={`h-4 w-4 ${inq.read ? "text-emerald-500" : ""}`} />
                    </button>
                    <button
                      onClick={() =>
                        setDeletingItem({ type: "inquiry", id: inq.id, title: `Inquiry from ${inq.fullName}` })
                      }
                      title="Delete"
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {inquiries.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No trade inquiries received yet.</p>
          )}
        </div>
      )}

      {/* TAB 3: SAMPLE REQUESTS */}
      {activeTab === "samples" && (
        <div className="space-y-3">
          {samples
            .filter((sample) => {
              const matchesSearch =
                sample.name?.toLowerCase().includes(search.toLowerCase()) ||
                sample.email?.toLowerCase().includes(search.toLowerCase()) ||
                sample.company?.toLowerCase().includes(search.toLowerCase()) ||
                sample.coffee?.name?.toLowerCase().includes(search.toLowerCase());
              const matchesStatus =
                sampleStatusFilter === "ALL" || sample.status === sampleStatusFilter;
              return matchesSearch && matchesStatus;
            })
            .map((sample) => {
              const statusCfg = SAMPLE_STATUSES.find((s) => s.value === sample.status);

              return (
                <div
                  key={sample.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{sample.name}</p>
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {sample.company}
                        </span>
                        <span className="text-xs text-muted-foreground">&lt;{sample.email}&gt;</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        {sample.coffee?.name && (
                          <span className="font-medium text-primary">☕ Coffee: {sample.coffee.name}</span>
                        )}
                        {sample.lot?.lotId && <span>🏷️ Lot: {sample.lot.lotId}</span>}
                        {sample.country && <span>📍 {sample.country}</span>}
                        {sample.quantity && <span>📦 Sample Size: {sample.quantity}</span>}
                      </div>

                      {sample.message && (
                        <p className="mt-2 text-sm text-muted-foreground">{sample.message}</p>
                      )}

                      {sample.adminNotes && (
                        <div className="mt-3 rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-900 dark:text-amber-200 border border-amber-500/20">
                          <strong>Internal Note:</strong> {sample.adminNotes}
                        </div>
                      )}

                      <p className="mt-3 text-xs text-muted-foreground/70">
                        {new Date(sample.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                          Pipeline Status
                        </label>
                        <select
                          value={sample.status}
                          onChange={(e) =>
                            handleUpdateSampleStatus(sample.id, e.target.value as SampleRequestStatus)
                          }
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none ${statusCfg?.color}`}
                        >
                          {SAMPLE_STATUSES.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() =>
                          setSampleNotesEdit({ id: sample.id, notes: sample.adminNotes || "" })
                        }
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        Notes
                      </button>

                      <button
                        onClick={() =>
                          setDeletingItem({
                            type: "sample",
                            id: sample.id,
                            title: `Sample request from ${sample.name}`,
                          })
                        }
                        title="Delete"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          {samples.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No sample requests received yet.</p>
          )}
        </div>
      )}

      {/* TAB 4: NEWSLETTER SUBSCRIBERS */}
      {activeTab === "subscribers" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5">Subscriber Email</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Subscribed Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers
                .filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
                .map((sub) => (
                  <tr key={sub.id} className="transition hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium text-foreground">{sub.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleSubscriber(sub.id, sub.active)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          sub.active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {sub.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          setDeletingItem({ type: "subscriber", id: sub.id, title: sub.email })
                        }
                        title="Delete Subscriber"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary uppercase">
                  {viewingItem.type}
                </span>
                <h2 className="mt-2 font-serif text-xl font-bold text-foreground">
                  {viewingItem.data.fullName || viewingItem.data.name}
                </h2>
                <p className="text-xs text-muted-foreground">{viewingItem.data.email}</p>
              </div>
              <a
                href={`mailto:${viewingItem.data.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
                Reply Email
              </a>
            </div>

            <div className="mt-6 space-y-4 text-sm border-t border-border pt-4">
              {viewingItem.data.company && (
                <div className="flex items-center gap-2 text-foreground">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{viewingItem.data.company}</span>
                </div>
              )}
              {viewingItem.data.phone && (
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{viewingItem.data.phone}</span>
                </div>
              )}
              {viewingItem.data.country && (
                <div className="flex items-center gap-2 text-foreground">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>{viewingItem.data.country}</span>
                </div>
              )}

              {viewingItem.data.subject && (
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Subject</p>
                  <p className="mt-1 font-medium">{viewingItem.data.subject}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-foreground/90 text-sm">
                  {viewingItem.data.message || "No message body provided."}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                <span>Received: {new Date(viewingItem.data.createdAt).toLocaleString()}</span>
                <span>Status: {viewingItem.data.read ? "Read" : "Unread"}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sample Notes Modal */}
      {sampleNotesEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-foreground">Internal Sample Notes</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Add tracking numbers, courier info, cupping feedback, or staff notes.
            </p>

            <textarea
              rows={4}
              value={sampleNotesEdit.notes}
              onChange={(e) => setSampleNotesEdit({ ...sampleNotesEdit, notes: e.target.value })}
              className="mt-4 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="e.g. DHL Tracking #12345678, shipped on 2026-09-04"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSampleNotesEdit(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSampleNotes}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {isAddSubscriberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-foreground">Add Subscriber</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Manually subscribe an email to the newsletter.
            </p>

            <form onSubmit={handleAddSubscriber} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newSubscriberEmail}
                  onChange={(e) => setNewSubscriberEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="subscriber@example.com"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddSubscriberOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newSubscriberEmail}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-serif text-xl font-bold">Delete Item</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deletingItem.title}</strong>? This action cannot be undone.
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
                onClick={() => {
                  if (deletingItem.type === "message") handleDeleteMessage();
                  else if (deletingItem.type === "inquiry") handleDeleteInquiry();
                  else if (deletingItem.type === "sample") handleDeleteSample();
                  else if (deletingItem.type === "subscriber") handleDeleteSubscriber();
                }}
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
