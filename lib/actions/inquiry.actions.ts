"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/session";
import {
  contactMessageRepository,
  tradeInquiryRepository,
  sampleRequestsRepository,
  subscribersRepository,
} from "@/lib/repositories/contact.repository";
import { activityRepository } from "@/lib/repositories/content.repository";
import type { SampleRequestStatus } from "@prisma/client";

// Contact Messages Actions
export async function toggleMessageReadAction(id: string, read: boolean) {
  await requirePermission("MANAGE_INQUIRIES");
  await contactMessageRepository.markRead(id, read);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const session = await requirePermission("MANAGE_INQUIRIES");
  await contactMessageRepository.delete(id);
  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "ContactMessage",
    entityId: id,
    details: `Deleted contact message ID ${id}`,
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// Inquiries Actions
export async function toggleInquiryReadAction(id: string, read: boolean) {
  await requirePermission("MANAGE_INQUIRIES");
  await tradeInquiryRepository.markRead(id, read);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteInquiryAction(id: string) {
  const session = await requirePermission("MANAGE_INQUIRIES");
  await tradeInquiryRepository.delete(id);
  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "Inquiry",
    entityId: id,
    details: `Deleted inquiry ID ${id}`,
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// Sample Requests Actions
export async function updateSampleRequestStatusAction(
  id: string,
  status: SampleRequestStatus,
  adminNotes?: string
) {
  const session = await requirePermission("MANAGE_SAMPLES");
  await sampleRequestsRepository.updateStatus(id, status, adminNotes);
  await activityRepository.log({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "SampleRequest",
    entityId: id,
    details: `Updated sample request status to ${status}`,
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/sample-requests");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteSampleRequestAction(id: string) {
  const session = await requirePermission("MANAGE_SAMPLES");
  await sampleRequestsRepository.delete(id);
  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "SampleRequest",
    entityId: id,
    details: `Deleted sample request ID ${id}`,
  });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/sample-requests");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// Subscriber Actions
export async function addSubscriberAction(email: string) {
  await requirePermission("MANAGE_INQUIRIES");
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address" };
  }
  const subscriber = await subscribersRepository.add(email);
  revalidatePath("/admin/inquiries");
  return { success: true, subscriber };
}

export async function toggleSubscriberActiveAction(id: string, active: boolean) {
  await requirePermission("MANAGE_INQUIRIES");
  await subscribersRepository.toggleActive(id, active);
  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function deleteSubscriberAction(id: string) {
  const session = await requirePermission("MANAGE_INQUIRIES");
  await subscribersRepository.delete(id);
  await activityRepository.log({
    userId: session.user.id,
    action: "DELETE",
    entityType: "NewsletterSubscriber",
    entityId: id,
    details: `Deleted newsletter subscriber ID ${id}`,
  });
  revalidatePath("/admin/inquiries");
  return { success: true };
}
