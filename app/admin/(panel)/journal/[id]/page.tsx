import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { journalService } from "@/lib/services/content.service";
import { JournalForm } from "@/components/admin/JournalForm";
import { updateJournalAction } from "@/lib/actions/admin.actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJournalPage({ params }: PageProps) {
  await requirePermission("MANAGE_JOURNAL");
  const { id } = await params;

  const [journalPost, categories, tags, postTags] = await Promise.all([
    prisma.journalPost.findUnique({ where: { id } }),
    journalService.getCategories(),
    journalService.getTags(),
    prisma.journalPostTag.findMany({ where: { postId: id } }),
  ]);

  if (!journalPost) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Edit Journal Post</h1>
      <div className="mt-8">
        <JournalForm
          post={{
            id: journalPost.id,
            title: journalPost.title,
            slug: journalPost.slug,
            excerpt: journalPost.excerpt ?? undefined,
            content: journalPost.content,
            categoryId: journalPost.categoryId ?? undefined,
            featured: journalPost.featured,
            published: journalPost.published,
            publishedAt: journalPost.publishedAt?.toISOString().slice(0, 16),
            scheduledAt: journalPost.scheduledAt?.toISOString().slice(0, 16),
            seoTitle: journalPost.seoTitle ?? undefined,
            seoDescription: journalPost.seoDescription ?? undefined,
            tagIds: postTags.map((t) => t.tagId),
          }}
          categories={categories}
          tags={tags}
          action={(data) => updateJournalAction(id, data)}
        />
      </div>
    </div>
  );
}
