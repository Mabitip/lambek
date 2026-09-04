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

import { SAMPLE_BLOG_POSTS } from "@/lib/constants/blog-data";

export const journalService = {
  async getPublished(filters?: {
    search?: string;
    category?: string;
    page?: number;
  }) {
    try {
      const res = await journalRepository.findPublished(filters);
      if (res && res.items && res.items.length > 0) {
        return res;
      }
    } catch {
      // Fallback to sample blog posts
    }

    let filtered = [...SAMPLE_BLOG_POSTS];
    if (filters?.category) {
      const catSlug = filters.category.toLowerCase();
      filtered = filtered.filter(
        (p) => p.category.slug === filters.category || p.category.name.toLowerCase().includes(catSlug)
      );
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    const page = filters?.page ?? 1;
    const limit = 12;
    const items = filtered.slice((page - 1) * limit, page * limit) as any;

    return {
      items,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    };
  },

  async getBySlug(slug: string) {
    try {
      const post = await journalRepository.findBySlug(slug);
      if (post?.published) return post;
    } catch {
      // fallback
    }

    const sample = SAMPLE_BLOG_POSTS.find((p) => p.slug === slug);
    if (sample) return sample as any;
    return null;
  },

  async getRelated(postId: string, categoryId?: string | null) {
    try {
      const related = await journalRepository.findRelated(postId, categoryId);
      if (related && related.length > 0) return related;
    } catch {
      // fallback
    }

    return SAMPLE_BLOG_POSTS.filter((p) => p.id !== postId).slice(0, 3) as any;
  },

  async getAdminList(page = 1) {
    return journalRepository.findAllAdmin(page);
  },

  async getCategories() {
    try {
      const cats = await journalRepository.getCategories();
      if (cats && cats.length > 0) return cats;
    } catch {
      // fallback
    }

    const uniqueMap = new Map<string, { id: string; name: string; slug: string }>();
    SAMPLE_BLOG_POSTS.forEach((p) => {
      uniqueMap.set(p.category.slug, p.category);
    });
    return Array.from(uniqueMap.values());
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
