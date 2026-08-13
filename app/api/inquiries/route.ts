import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { inquirySchema, sampleRequestSchema, contactSchema, newsletterSchema } from "@/lib/validations/schemas";
import { inquiryService, sampleService, contactService, newsletterService } from "@/lib/services/content.service";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`inquiry:${ip}`, 5, 60_000);
  if (!rl.success) return apiError("RATE_LIMIT", "Too many requests. Please try again later.", 429);

  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid request");
    }
    const inquiry = await inquiryService.submit(parsed.data);
    return apiSuccess(inquiry, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unable to submit inquiry", 500);
  }
}
