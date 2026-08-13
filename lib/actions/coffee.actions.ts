"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import { coffeeRepository } from "@/lib/repositories/coffee.repository";
import { coffeeFormSchema } from "@/lib/validations/schemas";
import { activityService } from "@/lib/services/content.service";

export async function createCoffeeAction(data: unknown) {
  await requirePermission("MANAGE_COFFEE");
  const parsed = coffeeFormSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const { originId, processId, varietyId, ...rest } = parsed.data;
  const coffee = await coffeeRepository.create({
    ...rest,
    ...(originId && { origin: { connect: { id: originId } } }),
    ...(processId && { process: { connect: { id: processId } } }),
    ...(varietyId && { variety: { connect: { id: varietyId } } }),
  });

  await activityService.log({ action: "CREATE", entityType: "Coffee", entityId: coffee.id });
  revalidatePath("/coffee");
  revalidatePath("/admin/coffees");
  return { success: true };
}

export async function updateCoffeeAction(id: string, data: unknown) {
  await requirePermission("MANAGE_COFFEE");
  const parsed = coffeeFormSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const { originId, processId, varietyId, ...rest } = parsed.data;
  await coffeeRepository.update(id, {
    ...rest,
    origin: originId ? { connect: { id: originId } } : { disconnect: true },
    process: processId ? { connect: { id: processId } } : { disconnect: true },
    variety: varietyId ? { connect: { id: varietyId } } : { disconnect: true },
  });

  await activityService.log({ action: "UPDATE", entityType: "Coffee", entityId: id });
  revalidatePath("/coffee");
  revalidatePath("/admin/coffees");
  return { success: true };
}

export async function deleteCoffeeAction(id: string) {
  await requirePermission("MANAGE_COFFEE");
  await coffeeRepository.delete(id);
  await activityService.log({ action: "DELETE", entityType: "Coffee", entityId: id });
  revalidatePath("/coffee");
  revalidatePath("/admin/coffees");
  return { success: true };
}

export async function addCoffeeLotAction(
  coffeeId: string,
  data: { lotId: string; harvest?: string; cupProfile?: string },
) {
  await requirePermission("MANAGE_COFFEE");
  const { prisma } = await import("@/lib/db/prisma");
  await prisma.coffeeLot.create({
    data: {
      lotId: data.lotId,
      coffeeId,
      harvest: data.harvest,
      cupProfile: data.cupProfile,
      published: true,
    },
  });
  revalidatePath(`/admin/coffees/${coffeeId}`);
  revalidatePath("/coffee");
}

export async function updateCoffeeAvailabilityAction(
  coffeeId: string,
  status: string,
  notes?: string,
) {
  await requirePermission("MANAGE_COFFEE");
  const { prisma } = await import("@/lib/db/prisma");
  await prisma.coffeeAvailability.create({
    data: {
      coffeeId,
      status: status as never,
      notes,
    },
  });
  revalidatePath(`/admin/coffees/${coffeeId}`);
  revalidatePath("/coffee");
}

export async function attachCoffeeImageAction(coffeeId: string, mediaId: string, isPrimary = false) {
  await requirePermission("MANAGE_COFFEE");
  const { prisma } = await import("@/lib/db/prisma");
  if (isPrimary) {
    await prisma.coffeeImage.updateMany({
      where: { coffeeId },
      data: { isPrimary: false },
    });
  }
  await prisma.coffeeImage.create({
    data: { coffeeId, mediaId, isPrimary },
  });
  revalidatePath(`/admin/coffees/${coffeeId}`);
  revalidatePath("/coffee");
}

export async function removeCoffeeImageAction(coffeeId: string, imageId: string) {
  await requirePermission("MANAGE_COFFEE");
  const { prisma } = await import("@/lib/db/prisma");
  await prisma.coffeeImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/coffees/${coffeeId}`);
}
