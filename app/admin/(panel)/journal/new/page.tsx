import { requirePermission } from "@/lib/auth/session";
import { journalService } from "@/lib/services/content.service";
import { JournalForm } from "@/components/admin/JournalForm";
import { createJournalAction } from "@/lib/actions/journal.actions";

export default async function NewJournalPage() {
  await requirePermission("MANAGE_JOURNAL");
  const [categories, tags] = await Promise.all([
    journalService.getCategories().catch(() => []),
    journalService.getTags().catch(() => []),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">New Journal Post</h1>
      <div className="mt-8">
        <JournalForm categories={categories} tags={tags} action={createJournalAction} />
      </div>
    </div>
  );
}
