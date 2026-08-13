import type { Coffee, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { coffeeFilterSchema } from "@/lib/validations/schemas";
import type { z } from "zod";

export type CoffeeFilters = z.infer<typeof coffeeFilterSchema>;

const coffeeInclude = {
  origin: true,
  process: true,
  variety: true,
  profile: true,
  images: { include: { media: true }, orderBy: { sortOrder: "asc" as const } },
  availability: { orderBy: { createdAt: "desc" as const }, take: 1 },
  lots: { where: { published: true } },
} satisfies Prisma.CoffeeInclude;

export type CoffeeWithRelations = Prisma.CoffeeGetPayload<{
  include: typeof coffeeInclude;
}>;

export const coffeeRepository = {
  async findMany(filters: CoffeeFilters) {
    const { origin, process, variety, availability, search, page, limit } =
      filters;
    const skip = (page - 1) * limit;

    const where: Prisma.CoffeeWhereInput = {
      published: true,
      ...(origin && { origin: { slug: origin } }),
      ...(process && { process: { slug: process } }),
      ...(variety && { variety: { slug: variety } }),
      ...(availability && {
        availability: { some: { status: availability as never } },
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { region: { contains: search, mode: "insensitive" } },
          { tastingNotes: { has: search } },
          { origin: { name: { contains: search, mode: "insensitive" } } },
          { process: { name: { contains: search, mode: "insensitive" } } },
          { variety: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.coffee.findMany({
        where,
        include: coffeeInclude,
        orderBy: [{ featured: "desc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.coffee.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findFeatured(limit = 6) {
    return prisma.coffee.findMany({
      where: { published: true, featured: true },
      include: coffeeInclude,
      orderBy: { name: "asc" },
      take: limit,
    });
  },

  async findBySlug(slug: string) {
    return prisma.coffee.findUnique({
      where: { slug },
      include: coffeeInclude,
    });
  },

  async findById(id: string) {
    return prisma.coffee.findUnique({
      where: { id },
      include: coffeeInclude,
    });
  },

  async findAllAdmin(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.CoffeeWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.coffee.findMany({
        where,
        include: coffeeInclude,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.coffee.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async create(data: Prisma.CoffeeCreateInput) {
    return prisma.coffee.create({ data, include: coffeeInclude });
  },

  async update(id: string, data: Prisma.CoffeeUpdateInput) {
    return prisma.coffee.update({
      where: { id },
      data,
      include: coffeeInclude,
    });
  },

  async delete(id: string) {
    return prisma.coffee.delete({ where: { id } });
  },

  async countPublished() {
    return prisma.coffee.count({ where: { published: true } });
  },

  async countAll() {
    return prisma.coffee.count();
  },
};

export const originRepository = {
  async findAll() {
    return prisma.coffeeOrigin.findMany({ orderBy: { name: "asc" } });
  },
};

export const processRepository = {
  async findAll() {
    return prisma.coffeeProcess.findMany({ orderBy: { name: "asc" } });
  },
};

export const varietyRepository = {
  async findAll() {
    return prisma.coffeeVariety.findMany({ orderBy: { name: "asc" } });
  },
};

export const lotRepository = {
  async findByLotId(lotId: string) {
    return prisma.coffeeLot.findFirst({
      where: {
        OR: [
          { lotId: { equals: lotId, mode: "insensitive" } },
          { lotId: { contains: lotId, mode: "insensitive" } },
        ],
        published: true,
      },
      include: {
        coffee: {
          include: {
            origin: true,
            process: true,
            variety: true,
            availability: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
    });
  },

  async search(query: string) {
    return prisma.coffeeLot.findMany({
      where: {
        published: true,
        OR: [
          { lotId: { contains: query, mode: "insensitive" } },
          { coffee: { name: { contains: query, mode: "insensitive" } } },
          { coffee: { origin: { name: { contains: query, mode: "insensitive" } } } },
          { coffee: { process: { name: { contains: query, mode: "insensitive" } } } },
        ],
      },
      include: {
        coffee: {
          include: {
            origin: true,
            process: true,
            variety: true,
            availability: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
      take: 10,
    });
  },
};

export const settingsRepository = {
  async getAll() {
    const settings = await prisma.siteSetting.findMany();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  },

  async get(key: string) {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return setting?.value ?? null;
  },

  async set(key: string, value: string, group = "general") {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group },
    });
  },

  async setMany(entries: { key: string; value: string; group?: string }[]) {
    for (const entry of entries) {
      await this.set(entry.key, entry.value, entry.group);
    }
  },
};

export type { Coffee };
