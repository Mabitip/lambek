import { prisma } from "@/lib/db/prisma";
import type { SampleRequestStatus } from "@prisma/client";

export const contactMessageRepository = {
  async findAll(options?: { search?: string; read?: boolean; limit?: number; page?: number }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const skip = (page - 1) * limit;

    const where = {
      ...(options?.read !== undefined && { read: options.read }),
      ...(options?.search && {
        OR: [
          { name: { contains: options.search, mode: "insensitive" as const } },
          { email: { contains: options.search, mode: "insensitive" as const } },
          { subject: { contains: options.search, mode: "insensitive" as const } },
          { message: { contains: options.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } });
  },

  async markRead(id: string, read = true) {
    return prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
  },

  async delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  },

  async countUnread() {
    return prisma.contactMessage.count({ where: { read: false } });
  },
};

export const tradeInquiryRepository = {
  async findAll(options?: {
    search?: string;
    requestType?: string;
    read?: boolean;
    limit?: number;
    page?: number;
  }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const skip = (page - 1) * limit;

    const where = {
      ...(options?.read !== undefined && { read: options.read }),
      ...(options?.requestType && { requestType: options.requestType as never }),
      ...(options?.search && {
        OR: [
          { fullName: { contains: options.search, mode: "insensitive" as const } },
          { email: { contains: options.search, mode: "insensitive" as const } },
          { company: { contains: options.search, mode: "insensitive" as const } },
          { message: { contains: options.search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: { coffee: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    return prisma.inquiry.findUnique({
      where: { id },
      include: { coffee: true },
    });
  },

  async markRead(id: string, read = true) {
    return prisma.inquiry.update({
      where: { id },
      data: { read },
    });
  },

  async delete(id: string) {
    return prisma.inquiry.delete({ where: { id } });
  },

  async countUnread() {
    return prisma.inquiry.count({ where: { read: false } });
  },
};

export const sampleRequestsRepository = {
  async findAll(options?: {
    search?: string;
    status?: SampleRequestStatus;
    limit?: number;
    page?: number;
  }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 50;
    const skip = (page - 1) * limit;

    const where = {
      ...(options?.status && { status: options.status }),
      ...(options?.search && {
        OR: [
          { name: { contains: options.search, mode: "insensitive" as const } },
          { email: { contains: options.search, mode: "insensitive" as const } },
          { company: { contains: options.search, mode: "insensitive" as const } },
        ],
      }),
    };

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

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    return prisma.sampleRequest.findUnique({
      where: { id },
      include: { coffee: true, lot: true },
    });
  },

  async updateStatus(id: string, status: SampleRequestStatus, adminNotes?: string) {
    return prisma.sampleRequest.update({
      where: { id },
      data: {
        status,
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });
  },

  async delete(id: string) {
    return prisma.sampleRequest.delete({ where: { id } });
  },
};

export const subscribersRepository = {
  async findAll(options?: { search?: string; active?: boolean; limit?: number; page?: number }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 100;
    const skip = (page - 1) * limit;

    const where = {
      ...(options?.active !== undefined && { active: options.active }),
      ...(options?.search && {
        email: { contains: options.search, mode: "insensitive" as const },
      }),
    };

    const [items, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async add(email: string) {
    return prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase().trim() },
      update: { active: true },
      create: { email: email.toLowerCase().trim() },
    });
  },

  async toggleActive(id: string, active: boolean) {
    return prisma.newsletterSubscriber.update({
      where: { id },
      data: { active },
    });
  },

  async delete(id: string) {
    return prisma.newsletterSubscriber.delete({ where: { id } });
  },
};
