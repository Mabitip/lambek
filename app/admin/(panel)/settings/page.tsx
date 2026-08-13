import { requirePermission } from "@/lib/auth/session";
import { settingsService } from "@/lib/services/coffee.service";
import { updateSettingsAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default async function AdminSettingsPage() {
  await requirePermission("MANAGE_SETTINGS");
  const settings: Record<string, string> = await settingsService.getAll().catch(() => ({}));

  const fields: {
    key: string;
    label: string;
    group: string;
    textarea?: boolean;
    hint?: string;
  }[] = [
    { key: "company_name", label: "Company Name", group: "general" },
    { key: "tagline", label: "Tagline", group: "general" },
    {
      key: "emails",
      label: "Emails",
      group: "contact",
      textarea: true,
      hint: "One email address per line",
    },
    {
      key: "phones",
      label: "Phones",
      group: "contact",
      textarea: true,
      hint: "One phone number per line",
    },
    { key: "address", label: "Address", group: "contact" },
    { key: "maps_url", label: "Google Maps URL", group: "contact" },
    { key: "working_hours", label: "Working Hours", group: "contact" },
    { key: "hero_headline", label: "Hero Headline", group: "hero", textarea: true },
    { key: "hero_subtext", label: "Hero Subtext", group: "hero", textarea: true },
    { key: "seo_default_title", label: "Default SEO Title", group: "seo" },
    { key: "seo_default_description", label: "Default SEO Description", group: "seo", textarea: true },
    { key: "footer_text", label: "Footer Text", group: "footer" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Site Settings</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          const entries = fields.map((f) => ({
            key: f.key,
            value: formData.get(f.key) as string,
            group: f.group,
          }));
          await updateSettingsAction(entries);
        }}
        className="mt-8 max-w-2xl space-y-6"
      >
        {fields.map((field) => (
          <div key={field.key}>
            <Label>{field.label}</Label>
            {field.textarea ? (
              <Textarea name={field.key} defaultValue={settings[field.key] ?? ""} rows={3} className="mt-1" />
            ) : (
              <Input name={field.key} defaultValue={settings[field.key] ?? ""} className="mt-1" />
            )}
            {field.hint && <p className="mt-1 text-xs text-foreground/50">{field.hint}</p>}
          </div>
        ))}
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
