import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/utils/api-response";
import { journalService } from "@/lib/services/content.service";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const data = await journalService.getPublished({
    search: params.get("search") ?? undefined,
    category: params.get("category") ?? undefined,
    page: Number(params.get("page") ?? 1),
  });
  return apiSuccess(data);
}
