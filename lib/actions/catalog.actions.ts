"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { activityRepository } from "@/lib/repositories/content.repository";

// Origins CRUD
export async function createOriginAction(data: {
  name: string;
  slug?: string;
  country?: string;
  region?: string;
  zone?: string;
  elevation?: string;
  description?: string;
}) {
  const session = await requirePermission("MANAGE_ORIGIN");
  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.name, { lower: true, strict: true });

  const existing = await prisma.coffeeOrigin.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "Origin slug already exists" };

  const origin = await prisma.coffeeOrigin.create({
    data: {
      name: data.name,
      slug,
      country: data.country || "Ethiopia",
      region: data.region,
      zone: data.zone,
      elevation: data.elevation,
      description: data.description,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "CoffeeOrigin",
    entityId: origin.id,
    details: `Created origin ${origin.name}`,
  });

  revalidatePath("/admin/origins");
  revalidatePath("/admin/coffees");
  return { success: true, origin };
}

export async function updateOriginAction(
  id: string,
  data: {
    name: string;
    slug?: string;
    country?: string;
    region?: string;
    zone?: string;
    elevation?: string;
    description?: string;
  }
) {
  const session = await requirePermission("MANAGE_ORIGIN");
  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.name, { lower: true, strict: true });

  const origin = await prisma.coffeeOrigin.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      country: data.country || "Ethiopia",
      region: data.region,
      zone: data.zone,
      elevation: data.elevation,
      description: data.description,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "CoffeeOrigin",
    entityId: id,
    details: `Updated origin ${origin.name}`,
  });

  revalidatePath("/admin/origins");
  revalidatePath("/admin/coffees");
  return { success: true, origin };
}

export async function deleteOriginAction(id: string) {
  const session = await requirePermission("MANAGE_ORIGIN");
  await prisma.coffeeOrigin.delete({ where: { id } });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "CoffeeOrigin",
    entityId: id,
    details: `Deleted origin ID ${id}`,
  });

  revalidatePath("/admin/origins");
  revalidatePath("/admin/coffees");
  return { success: true };
}

// Processes CRUD
export async function createProcessAction(data: {
  name: string;
  slug?: string;
  description?: string;
}) {
  const session = await requirePermission("MANAGE_COFFEE");
  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.name, { lower: true, strict: true });

  const existing = await prisma.coffeeProcess.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "Process slug already exists" };

  const process = await prisma.coffeeProcess.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "CoffeeProcess",
    entityId: process.id,
    details: `Created coffee process ${process.name}`,
  });

  revalidatePath("/admin/processes");
  revalidatePath("/admin/origins");
  revalidatePath("/admin/coffees");
  return { success: true, process };
}

export async function updateProcessAction(
  id: string,
  data: {
    name: string;
    slug?: string;
    description?: string;
  }
) {
  const session = await requirePermission("MANAGE_COFFEE");
  const slug = data.slug?.trim()
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.name, { lower: true, strict: true });

  const process = await prisma.coffeeProcess.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "CoffeeProcess",
    entityId: id,
    details: `Updated coffee process ${process.name}`,
  });

  revalidatePath("/admin/processes");
  revalidatePath("/admin/origins");
  revalidatePath("/admin/coffees");
  return { success: true, process };
}

export async function deleteProcessAction(id: string) {
  const session = await requirePermission("MANAGE_COFFEE");
  await prisma.coffeeProcess.delete({ where: { id } });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "CoffeeProcess",
    entityId: id,
    details: `Deleted coffee process ID ${id}`,
  });

  revalidatePath("/admin/processes");
  revalidatePath("/admin/origins");
  revalidatePath("/admin/coffees");
  return { success: true };
}

// Testimonials CRUD
export async function createTestimonialAction(data: {
  name: string;
  role?: string;
  company?: string;
  content: string;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
}) {
  const session = await requirePermission("MANAGE_SETTINGS");
  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name,
      role: data.role,
      company: data.company,
      content: data.content,
      featured: data.featured ?? false,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "Testimonial",
    entityId: testimonial.id,
    details: `Created testimonial by ${testimonial.name}`,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true, testimonial };
}

export async function updateTestimonialAction(
  id: string,
  data: {
    name: string;
    role?: string;
    company?: string;
    content: string;
    featured?: boolean;
    published?: boolean;
    sortOrder?: number;
  }
) {
  const session = await requirePermission("MANAGE_SETTINGS");
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data,
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "Testimonial",
    entityId: id,
    details: `Updated testimonial by ${testimonial.name}`,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true, testimonial };
}

export async function deleteTestimonialAction(id: string) {
  const session = await requirePermission("MANAGE_SETTINGS");
  await prisma.testimonial.delete({ where: { id } });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "Testimonial",
    entityId: id,
    details: `Deleted testimonial ID ${id}`,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

// Partners CRUD
export async function createPartnerAction(data: {
  name: string;
  logoUrl?: string;
  website?: string;
  sortOrder?: number;
  published?: boolean;
}) {
  const session = await requirePermission("MANAGE_SETTINGS");
  const partner = await prisma.partner.create({
    data: {
      name: data.name,
      logoUrl: data.logoUrl,
      website: data.website,
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? true,
    },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "CREATE",
    entityType: "Partner",
    entityId: partner.id,
    details: `Created partner ${partner.name}`,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true, partner };
}

export async function updatePartnerAction(
  id: string,
  data: {
    name: string;
    logoUrl?: string;
    website?: string;
    sortOrder?: number;
    published?: boolean;
  }
) {
  const session = await requirePermission("MANAGE_SETTINGS");
  const partner = await prisma.partner.update({
    where: { id },
    data,
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "Partner",
    entityId: id,
    details: `Updated partner ${partner.name}`,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true, partner };
}

export async function deletePartnerAction(id: string) {
  const session = await requirePermission("MANAGE_SETTINGS");
  await prisma.partner.delete({ where: { id } });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "Partner",
    entityId: id,
    details: `Deleted partner ID ${id}`,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { success: true };
}

// Quick Coffee Actions
export async function toggleCoffeePublishedAction(id: string, published: boolean) {
  const session = await requirePermission("MANAGE_COFFEE");
  const coffee = await prisma.coffee.update({
    where: { id },
    data: { published },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: published ? "PUBLISH" : "UNPUBLISH",
    entityType: "Coffee",
    entityId: id,
    details: `${published ? "Published" : "Unpublished"} coffee "${coffee.name}"`,
  });

  revalidatePath("/admin/coffees");
  revalidatePath("/coffees");
  return { success: true, coffee };
}

export async function toggleCoffeeFeaturedAction(id: string, featured: boolean) {
  const session = await requirePermission("MANAGE_COFFEE");
  const coffee = await prisma.coffee.update({
    where: { id },
    data: { featured },
  });

  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "Coffee",
    entityId: id,
    details: `Set coffee "${coffee.name}" featured = ${featured}`,
  });

  revalidatePath("/admin/coffees");
  revalidatePath("/coffees");
  return { success: true, coffee };
}

export async function deleteCoffeeAction(id: string) {
  const session = await requirePermission("MANAGE_COFFEE");
  const coffee = await prisma.coffee.findUnique({ where: { id } });
  if (!coffee) return { success: false, error: "Coffee not found" };

  await prisma.coffee.delete({ where: { id } });

  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "Coffee",
    entityId: id,
    details: `Deleted coffee "${coffee.name}"`,
  });

  revalidatePath("/admin/coffees");
  revalidatePath("/coffees");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
