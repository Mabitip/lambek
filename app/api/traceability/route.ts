import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils/api-response";
import { coffeeService } from "@/lib/services/coffee.service";
import { traceabilitySearchSchema } from "@/lib/validations/schemas";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const parsed = traceabilitySearchSchema.safeParse({ query });
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Enter a lot ID or search term");
  }

  const results = await coffeeService.searchTraceability(parsed.data.query);
  return apiSuccess(results);
}
