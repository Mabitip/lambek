import {
  journalRepository,
  inquiryRepository,
  sampleRepository,
  contactRepository,
  newsletterRepository,
  dashboardRepository,
  activityRepository,
} from "@/lib/repositories/content.repository";
import { emailService } from "@/lib/email/email.service";
import type {
  InquiryInput,
  SampleRequestInput,
  ContactInput,
} from "@/lib/validations/schemas";
import { calculateReadingTime } from "@/lib/utils/cn";

export const journalService = {
  async getPublished(filters?: {
    search?: string;
    category?: string;
    page?: number;
  }) {
    return journalRepository.findPublished(filters);
  },

  async getBySlug(slug: string) {
    const post = await journalRepository.findBySlug(slug);
    if (!post?.published) return null;
    return post;
  },

  async getRelated(postId: string, categoryId?: string | null) {
    return journalRepository.findRelated(postId, categoryId);
  },

  async getAdminList(page = 1) {
    return journalRepository.findAllAdmin(page);
  },

  async getCategories() {
    return journalRepository.getCategories();
  },

  async getTags() {
    return journalRepository.getTags();
  },

  computeReadingTime(content: string) {
    return calculateReadingTime(content);
  },
};

export const inquiryService = {
  async submit(data: InquiryInput) {
    const inquiry = await inquiryRepository.create({
      fullName: data.fullName,
      company: data.company,
      email: data.email,
      phone: data.phone,
      country: data.country,
      interestedCoffee: data.interestedCoffee,
      preferredProcess: data.preferredProcess,
      estimatedQuantity: data.estimatedQuantity,
      requestType: data.requestType,
      message: data.message,
      ...(data.coffeeId && {
        coffee: { connect: { id: data.coffeeId } },
      }),
    });

    await emailService.sendInquiryNotification(inquiry);
    return inquiry;
  },

  async getAll(page = 1) {
    return inquiryRepository.findAll(page);
  },

  async markRead(id: string) {
    return inquiryRepository.markRead(id);
  },
};

export const sampleService = {
  async submit(data: SampleRequestInput) {
    const sample = await sampleRepository.create({
      company: data.company,
      name: data.name,
      email: data.email,
      country: data.country,
      quantity: data.quantity,
      message: data.message,
      ...(data.coffeeId && { coffee: { connect: { id: data.coffeeId } } }),
      ...(data.lotId && { lot: { connect: { id: data.lotId } } }),
    });

    await emailService.sendSampleNotification(sample);
    return sample;
  },

  async getAll(page = 1, status?: string) {
    return sampleRepository.findAll(page, 20, status);
  },

  async updateStatus(id: string, status: string, adminNotes?: string) {
    return sampleRepository.updateStatus(id, status, adminNotes);
  },
};

export const contactService = {
  async submit(data: ContactInput) {
    const message = await contactRepository.create(data);
    await emailService.sendContactNotification(message);
    return message;
  },
};

export const newsletterService = {
  async subscribe(email: string) {
    return newsletterRepository.subscribe(email);
  },
};

export const dashboardService = {
  async getStats() {
    return dashboardRepository.getStats();
  },

  async getRecentActivity() {
    return dashboardRepository.getRecentActivity();
  },

  async getChartData(days = 30) {
    return dashboardRepository.getChartData(days);
  },
};

export const activityService = {
  log: activityRepository.log,
};
