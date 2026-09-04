import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  await requirePermission("MANAGE_SETTINGS");

  const settings = await prisma.siteSetting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  return (
    <SettingsManager
      initialSettings={JSON.parse(JSON.stringify(settings))}
    />
  );
}
