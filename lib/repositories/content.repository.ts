import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

const journalInclude = {
  author: { select: { id: true, name: true, email: true } },
  category: true,
  coverImage: true,
  tags: { include: { tag: true } },
} satisfies Prisma.JournalPostInclude;

export const journalRepository = {
  async findPublished(filters?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.JournalPostWhereInput = {
      published: true,
      ...(filters?.category && {
        category: { slug: filters.category },
      }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { excerpt: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: filters.search, mode: "insensitive" } } } } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.journalPost.findMany({
        where,
        include: journalInclude,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.journalPost.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findBySlug(slug: string) {
    return prisma.journalPost.findUnique({
      where: { slug },
      include: journalInclude,
    });
  },

  async findRelated(postId: string, categoryId?: string | null, limit = 3) {
    return prisma.journalPost.findMany({
      where: {
        published: true,
        id: { not: postId },
        ...(categoryId && { categoryId }),
      },
      include: journalInclude,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  },

  async findAllAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.journalPost.findMany({
        include: journalInclude,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.journalPost.count(),
    ]);
    return { items, total, page, limit };
  },

  async create(data: Prisma.JournalPostCreateInput) {
    return prisma.journalPost.create({ data, include: journalInclude });
  },

  async update(id: string, data: Prisma.JournalPostUpdateInput) {
    return prisma.journalPost.update({
      where: { id },
      data,
      include: journalInclude,
    });
  },

  async delete(id: string) {
    return prisma.journalPost.delete({ where: { id } });
  },

  async countPublished() {
    return prisma.journalPost.count({ where: { published: true } });
  },

  async getCategories() {
    return prisma.journalCategory.findMany({ orderBy: { name: "asc" } });
  },

  async getTags() {
    return prisma.journalTag.findMany({ orderBy: { name: "asc" } });
  },
};

export const inquiryRepository = {
  async create(data: Prisma.InquiryCreateInput) {
    return prisma.inquiry.create({ data });
  },

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({
        include: { coffee: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inquiry.count(),
    ]);
    return { items, total, page, limit };
  },

  async count() {
    return prisma.inquiry.count();
  },

  async markRead(id: string) {
    return prisma.inquiry.update({ where: { id }, data: { read: true } });
  },
};

export const sampleRepository = {
  async create(data: Prisma.SampleRequestCreateInput) {
    return prisma.sampleRequest.create({ data });
  },

  async findAll(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as never } : {};
    const [items, total] = await Promise.all([
      prisma.sampleRequest.findMany({
        where,
        include: { coffee: true, lot: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.sampleRequest.count({ where }),
    ]);
    return { items, total, page, limit };
  },

  async updateStatus(id: string, status: string, adminNotes?: string) {
    return prisma.sampleRequest.update({
      where: { id },
      data: { status: status as never, ...(adminNotes && { adminNotes }) },
    });
  },

  async count() {
    return prisma.sampleRequest.count();
  },
};

export const contactRepository = {
  async create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({ data });
  },
};

export const newsletterRepository = {
  async subscribe(email: string) {
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });
  },

  async count() {
    return prisma.newsletterSubscriber.count({ where: { active: true } });
  },
};

export const dashboardRepository = {
  async getStats() {
    const [
      totalCoffees,
      publishedCoffees,
      sampleRequests,
      inquiries,
      journalPosts,
      subscribers,
    ] = await Promise.all([
      prisma.coffee.count(),
      prisma.coffee.count({ where: { published: true } }),
      prisma.sampleRequest.count(),
      prisma.inquiry.count(),
      prisma.journalPost.count({ where: { published: true } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
    ]);

    return {
      totalCoffees,
      publishedCoffees,
      sampleRequests,
      inquiries,
      journalPosts,
      subscribers,
    };
  },

  async getRecentActivity() {
    const [samples, inquiries, posts, logs] = await Promise.all([
      prisma.sampleRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { coffee: true },
      }),
      prisma.inquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      prisma.journalPost.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return { samples, inquiries, posts, logs };
  },

  async getChartData(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [inquiries, samples] = await Promise.all([
      prisma.inquiry.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.sampleRequest.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, status: true },
      }),
    ]);

    return { inquiries, samples };
  },
};

export const activityRepository = {
  async log(data: {
    userId?: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "PUBLISH" | "UNPUBLISH";
    entityType?: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
  }) {
    return prisma.activityLog.create({ data });
  },
};

export const mediaRepository = {
  async findAll(page = 1, limit = 24) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.media.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.media.count(),
    ]);
    return { items, total, page, limit };
  },

  async create(data: Prisma.MediaCreateInput) {
    return prisma.media.create({ data });
  },

  async delete(id: string) {
    return prisma.media.delete({ where: { id } });
  },
};
