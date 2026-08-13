import { z } from "zod";

export const inquirySchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  country: z.string().optional(),
  interestedCoffee: z.string().optional(),
  coffeeId: z.string().uuid().optional().or(z.literal("")),
  preferredProcess: z.string().optional(),
  estimatedQuantity: z.string().optional(),
  requestType: z.enum([
    "GREEN_COFFEE",
    "SAMPLE",
    "WHOLESALE",
    "EXPORT",
    "PARTNERSHIP",
    "OTHER",
  ]),
  message: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const sampleRequestSchema = z.object({
  coffeeId: z.string().uuid().optional().or(z.literal("")),
  lotId: z.string().uuid().optional().or(z.literal("")),
  company: z.string().min(1, "Company is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  country: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().optional(),
});

export type SampleRequestInput = z.infer<typeof sampleRequestSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Valid email required"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const coffeeFilterSchema = z.object({
  origin: z.string().optional(),
  process: z.string().optional(),
  variety: z.string().optional(),
  availability: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
});

export const traceabilitySearchSchema = z.object({
  query: z.string().min(1, "Enter a lot ID or search term"),
});

export const coffeeFormSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  region: z.string().optional(),
  microRegion: z.string().optional(),
  country: z.string().default("Ethiopia"),
  altitudeMin: z.coerce.number().optional(),
  altitudeMax: z.coerce.number().optional(),
  harvestPeriod: z.string().optional(),
  cupScore: z.coerce.number().optional(),
  cupProfile: z.string().optional(),
  tastingNotes: z.array(z.string()).default([]),
  packaging: z.string().optional(),
  processingStory: z.string().optional(),
  qualityInfo: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  originId: z.string().optional(),
  processId: z.string().optional(),
  varietyId: z.string().optional(),
});

export const journalFormSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  categoryId: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
});
