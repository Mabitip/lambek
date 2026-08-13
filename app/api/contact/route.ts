import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { contactSchema, newsletterSchema } from "@/lib/validations/schemas";
import { contactService, newsletterService } from "@/lib/services/content.service";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!rl.success) return apiError("RATE_LIMIT", "Too many requests. Please try again later.", 429);

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid request");
    }
    const message = await contactService.submit(parsed.data);
    return apiSuccess(message, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unable to send message", 500);
  }
}
