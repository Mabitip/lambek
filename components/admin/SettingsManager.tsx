"use client";

import { useState } from "react";
import {
  Settings,
  Building,
  Phone,
  Sparkles,
  Globe,
  Sliders,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateSettingsAction,
  createCustomSettingAction,
  deleteCustomSettingAction,
} from "@/lib/actions/settings.actions";

type SettingItem = {
  id: string;
  key: string;
  value: string;
  group: string;
};

export function SettingsManager({
  initialSettings,
}: {
  initialSettings: SettingItem[];
}) {
  const [settings, setSettings] = useState<SettingItem[]>(initialSettings);
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "about" | "seo" | "custom">("general");

  // Local state map for form inputs
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialSettings.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  });

  // Custom setting form
  const [newCustomKey, setNewCustomKey] = useState("");
  const [newCustomValue, setNewCustomValue] = useState("");
  const [newCustomGroup, setNewCustomGroup] = useState("custom");
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveTab = async (groupName: string, keys: string[]) => {
    setLoading(true);
    try {
      const entries = keys.map((k) => ({
        key: k,
        value: formValues[k] ?? "",
        group: groupName,
      }));

      const res = await updateSettingsAction(entries);
      if (res.success) {
        toast.success(`${groupName.toUpperCase()} settings saved successfully`);
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCustomSettingAction({
        key: newCustomKey,
        value: newCustomValue,
        group: newCustomGroup,
      });

      if (res.success && res.setting) {
        setSettings([...settings.filter((s) => s.key !== res.setting.key), res.setting]);
        setFormValues((prev) => ({ ...prev, [res.setting.key]: res.setting.value }));
        toast.success(`Custom setting "${newCustomKey}" saved`);
        setNewCustomKey("");
        setNewCustomValue("");
        setIsAddCustomOpen(false);
      } else {
        toast.error(res.error || "Failed to add custom setting");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm(`Are you sure you want to delete setting "${key}"?`)) return;
    setLoading(true);
    try {
      const res = await deleteCustomSettingAction(key);
      if (res.success) {
        setSettings(settings.filter((s) => s.key !== key));
        toast.success(`Setting "${key}" removed`);
      } else {
        toast.error("Failed to delete setting");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Global Site Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure branding, company contact info, homepage narrative, SEO metadata, and dynamic custom variables.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "general"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building className="h-4 w-4" />
          <span>General & Hero</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "contact"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Contact & Locations</span>
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "about"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>About & Services</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "seo"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>SEO & Metadata</span>
        </button>

        <button
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "custom"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Custom Settings ({settings.length})</span>
        </button>
      </div>

      {/* TAB 1: GENERAL */}
      {activeTab === "general" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company Name
            </label>
            <input
              type="text"
              value={formValues["company_name"] || ""}
              onChange={(e) => handleChange("company_name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="e.g. Lambek Coffee Ltd"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tagline
            </label>
            <input
              type="text"
              value={formValues["tagline"] || ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="e.g. Where Traditions Meet Aroma"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hero Headline
            </label>
            <textarea
              rows={2}
              value={formValues["hero_headline"] || ""}
              onChange={(e) => handleChange("hero_headline", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="WHERE TRADITIONS&#10;MEET AROMA"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hero Subtext
            </label>
            <textarea
              rows={3}
              value={formValues["hero_subtext"] || ""}
              onChange={(e) => handleChange("hero_subtext", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Exceptional Ethiopian coffee, carefully processed and prepared for the world."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={formValues["footer_text"] || ""}
              onChange={(e) => handleChange("footer_text", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="© Lambek Coffee Ltd. All rights reserved."
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              onClick={() =>
                handleSaveTab("general", [
                  "company_name",
                  "tagline",
                  "hero_headline",
                  "hero_subtext",
                  "footer_text",
                ])
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save General Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT */}
      {activeTab === "contact" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Email Addresses (One per line)
            </label>
            <textarea
              rows={3}
              value={formValues["emails"] || ""}
              onChange={(e) => handleChange("emails", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              placeholder="info@lambekcoffee.com&#10;sales@lambekcoffee.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Phone Numbers (One per line)
            </label>
            <textarea
              rows={3}
              value={formValues["phones"] || ""}
              onChange={(e) => handleChange("phones", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              placeholder="+251911210468&#10;+251911112156"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Physical Office Address
            </label>
            <input
              type="text"
              value={formValues["address"] || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Ejigayhu Dibaba bldg, 5th Floor, Addis Ababa, Ethiopia"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Google Maps Location URL
            </label>
            <input
              type="url"
              value={formValues["maps_url"] || ""}
              onChange={(e) => handleChange("maps_url", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Working Hours
            </label>
            <input
              type="text"
              value={formValues["working_hours"] || ""}
              onChange={(e) => handleChange("working_hours", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Monday–Friday: 8:30 – 17:30"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              onClick={() =>
                handleSaveTab("contact", [
                  "emails",
                  "phones",
                  "address",
                  "maps_url",
                  "working_hours",
                ])
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Contact Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ABOUT */}
      {activeTab === "about" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company Overview & Story
            </label>
            <textarea
              rows={6}
              value={formValues["about_text"] || ""}
              onChange={(e) => handleChange("about_text", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Lambek Coffee is a company set into action since April 2020..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Core Values (JSON Array or List)
            </label>
            <textarea
              rows={4}
              value={formValues["values"] || ""}
              onChange={(e) => handleChange("values", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              placeholder='["Create shared values", "Transparency across all the value chain", "Quality product and standard service"]'
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Services (JSON Array or List)
            </label>
            <textarea
              rows={4}
              value={formValues["services"] || ""}
              onChange={(e) => handleChange("services", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
              placeholder='["We process and export coffee...", "Provide Good Agricultural Practices..."]'
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              onClick={() => handleSaveTab("about", ["about_text", "values", "services"])}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save About Content
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Default SEO Title
            </label>
            <input
              type="text"
              value={formValues["seo_default_title"] || ""}
              onChange={(e) => handleChange("seo_default_title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Lambek Coffee | Ethiopian Yirgacheffe Green Coffee Exporter"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Default SEO Meta Description
            </label>
            <textarea
              rows={3}
              value={formValues["seo_default_description"] || ""}
              onChange={(e) => handleChange("seo_default_description", e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="Lambek Coffee Ltd — processor and exporter of high quality Ethiopian Yirgacheffe..."
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              onClick={() =>
                handleSaveTab("seo", ["seo_default_title", "seo_default_description"])
              }
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save SEO Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: DYNAMIC CUSTOM SETTINGS */}
      {activeTab === "custom" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              All registered site settings. You can add new key-value pairs or edit values directly.
            </p>
            <button
              onClick={() => setIsAddCustomOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Custom Setting
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3.5">Key</th>
                  <th className="px-6 py-3.5">Group</th>
                  <th className="px-6 py-3.5">Value</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {settings.map((item) => (
                  <tr key={item.id} className="transition hover:bg-muted/20">
                    <td className="px-6 py-3.5 font-mono text-xs font-semibold text-primary">
                      {item.key}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {item.group}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <input
                        type="text"
                        value={formValues[item.key] ?? item.value}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full max-w-md rounded border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const res = await updateSettingsAction([
                                { key: item.key, value: formValues[item.key] ?? item.value, group: item.group },
                              ]);
                              if (res.success) toast.success(`Saved "${item.key}"`);
                            } catch {
                              toast.error("Failed to save");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="rounded p-1 text-primary hover:bg-primary/10"
                          title="Save Value"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSetting(item.key)}
                          className="rounded p-1 text-muted-foreground hover:text-destructive"
                          title="Delete Setting"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Custom Setting Modal */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-foreground">Add Custom Setting</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Define a dynamic configuration key and value.
            </p>

            <form onSubmit={handleAddCustomSetting} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Setting Key (e.g. instagram_url, banner_announcement)
                </label>
                <input
                  type="text"
                  required
                  value={newCustomKey}
                  onChange={(e) => setNewCustomKey(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none"
                  placeholder="custom_key"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Group Category
                </label>
                <input
                  type="text"
                  required
                  value={newCustomGroup}
                  onChange={(e) => setNewCustomGroup(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="general, social, header, footer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Value
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCustomValue}
                  onChange={(e) => setNewCustomValue(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Setting value..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newCustomKey}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Setting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
