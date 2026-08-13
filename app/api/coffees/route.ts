import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/utils/api-response";
import { coffeeService } from "@/lib/services/coffee.service";
import { coffeeFilterSchema } from "@/lib/validations/schemas";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = coffeeFilterSchema.parse(params);
  const data = await coffeeService.getPublished(filters);
  return apiSuccess(data);
}
