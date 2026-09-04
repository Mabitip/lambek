import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export default async function AdminTestimonialsPage() {
  await requirePermission("MANAGE_SETTINGS");

  const [testimonials, partners] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    prisma.partner.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);

  return (
    <TestimonialsManager
      initialTestimonials={JSON.parse(JSON.stringify(testimonials))}
      initialPartners={JSON.parse(JSON.stringify(partners))}
    />
  );
}
