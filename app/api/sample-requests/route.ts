import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { sampleRequestSchema } from "@/lib/validations/schemas";
import { sampleService } from "@/lib/services/content.service";
import { getClientIp, rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`sample:${ip}`, 5, 60_000);
  if (!rl.success) return apiError("RATE_LIMIT", "Too many requests. Please try again later.", 429);

  try {
    const body = await request.json();
    const parsed = sampleRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid request");
    }
    const sample = await sampleService.submit(parsed.data);
    return apiSuccess(sample, 201);
  } catch {
    return apiError("INTERNAL_ERROR", "Unable to submit sample request", 500);
  }
}
