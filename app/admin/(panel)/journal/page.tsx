import { requirePermission } from "@/lib/auth/session";
import { journalRepository } from "@/lib/repositories/content.repository";
import { JournalManager } from "@/components/admin/JournalManager";

export default async function AdminJournalPage() {
  await requirePermission("MANAGE_JOURNAL");

  const [postsRes, categories, tags] = await Promise.all([
    journalRepository.findAllAdmin(1, 100).catch(() => ({ items: [] })),
    journalRepository.getCategories().catch(() => []),
    journalRepository.getTags().catch(() => []),
  ]);

  return (
    <JournalManager
      initialPosts={JSON.parse(JSON.stringify(postsRes.items))}
      initialCategories={JSON.parse(JSON.stringify(categories))}
      initialTags={JSON.parse(JSON.stringify(tags))}
    />
  );
}
