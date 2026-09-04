"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { journalRepository, activityRepository } from "@/lib/repositories/content.repository";
import { journalService } from "@/lib/services/content.service";

export async function createJournalAction(data: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImageId?: string;
  categoryId?: string;
  tagIds?: string[];
  featured?: boolean;
  published?: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  const session = await requirePermission("MANAGE_JOURNAL");

  if (!data.title || !data.content) {
    return { success: false, error: "Title and content are required" };
  }

  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  const existing = await journalRepository.findBySlug(slug);
  if (existing) {
    return { success: false, error: "An article with this slug already exists" };
  }

  const readingTime = journalService.computeReadingTime(data.content);

  const post = await journalRepository.create({
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    readingTime,
    featured: data.featured ?? false,
    published: data.published ?? false,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.published ? new Date() : null,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    seoTitle: data.seoTitle || data.title,
    seoDescription: data.seoDescription || data.excerpt,
    author: { connect: { id: session.user.id } },
    ...(data.coverImageId && { coverImage: { connect: { id: data.coverImageId } } }),
    ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
    ...(data.tagIds && data.tagIds.length > 0 && {
      tags: {
        create: data.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    }),
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "JournalPost",
    entityId: post.id,
    details: `Created blog article "${post.title}"`,
  });

  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  revalidatePath("/admin/dashboard");
  return { success: true, post };
}

export async function updateJournalAction(
  id: string,
  data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImageId?: string | null;
    categoryId?: string | null;
    tagIds?: string[];
    featured?: boolean;
    published?: boolean;
    publishedAt?: string | null;
    scheduledAt?: string | null;
    seoTitle?: string;
    seoDescription?: string;
  }
) {
  const session = await requirePermission("MANAGE_JOURNAL");

  if (!data.title || !data.content) {
    return { success: false, error: "Title and content are required" };
  }

  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  const existing = await journalRepository.findBySlug(slug);
  if (existing && existing.id !== id) {
    return { success: false, error: "An article with this slug already exists" };
  }

  const readingTime = journalService.computeReadingTime(data.content);

  // Remove existing tags if tagIds is provided
  if (data.tagIds !== undefined) {
    await prisma.journalPostTag.deleteMany({ where: { postId: id } });
    if (data.tagIds.length > 0) {
      await prisma.journalPostTag.createMany({
        data: data.tagIds.map((tagId) => ({
          postId: id,
          tagId,
        })),
      });
    }
  }

  const post = await journalRepository.update(id, {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    readingTime,
    featured: data.featured ?? false,
    published: data.published ?? false,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.published ? new Date() : null,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    seoTitle: data.seoTitle || data.title,
    seoDescription: data.seoDescription || data.excerpt,
    coverImage: data.coverImageId
      ? { connect: { id: data.coverImageId } }
      : { disconnect: true },
    category: data.categoryId
      ? { connect: { id: data.categoryId } }
      : { disconnect: true },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "JournalPost",
    entityId: id,
    details: `Updated blog article "${post.title}"`,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/journal");
  return { success: true, post };
}

export async function deleteJournalAction(id: string) {
  const session = await requirePermission("MANAGE_JOURNAL");
  const post = await prisma.journalPost.findUnique({ where: { id } });
  if (!post) return { success: false, error: "Post not found" };

  await journalRepository.delete(id);

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "JournalPost",
    entityId: id,
    details: `Deleted blog article "${post.title}"`,
  });

  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function toggleJournalPublishAction(id: string, published: boolean) {
  const session = await requirePermission("MANAGE_JOURNAL");
  const post = await journalRepository.update(id, {
    published,
    publishedAt: published ? new Date() : null,
  });

  await activityRepository.log({
    userId: session.user.id,
    action: published ? "PUBLISH" : "UNPUBLISH",
    entityType: "JournalPost",
    entityId: id,
    details: `${published ? "Published" : "Unpublished"} article "${post.title}"`,
  });

  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  return { success: true, post };
}

// Category Actions
export async function createCategoryAction(data: { name: string; slug?: string; description?: string }) {
  await requirePermission("MANAGE_JOURNAL");
  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.name, { lower: true, strict: true });

  const existing = await prisma.journalCategory.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: "Category slug already exists" };
  }

  const category = await prisma.journalCategory.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  return { success: true, category };
}

export async function updateCategoryAction(
  id: string,
  data: { name: string; slug?: string; description?: string }
) {
  await requirePermission("MANAGE_JOURNAL");
  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.name, { lower: true, strict: true });

  const category = await prisma.journalCategory.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  return { success: true, category };
}

export async function deleteCategoryAction(id: string) {
  await requirePermission("MANAGE_JOURNAL");
  await prisma.journalCategory.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/journal");
  return { success: true };
}

// Tag Actions
export async function createTagAction(name: string) {
  await requirePermission("MANAGE_JOURNAL");
  const slug = slugify(name, { lower: true, strict: true });
  const tag = await prisma.journalTag.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
  revalidatePath("/admin/journal");
  return { success: true, tag };
}

export async function deleteTagAction(id: string) {
  await requirePermission("MANAGE_JOURNAL");
  await prisma.journalTag.delete({ where: { id } });
  revalidatePath("/admin/journal");
  return { success: true };
}
