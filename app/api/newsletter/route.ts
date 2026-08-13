import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { newsletterSchema } from "@/lib/validations/schemas";
import { newsletterService } from "@/lib/services/content.service";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`newsletter:${ip}`, 3, 60_000);
  if (!rl.success) return apiError("RATE_LIMIT", "Too many requests.", 429);

  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Valid email required");
    }
    const subscriber = await newsletterService.subscribe(parsed.data.email);
    return apiSuccess(subscriber, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unable to subscribe", 500);
  }
}
