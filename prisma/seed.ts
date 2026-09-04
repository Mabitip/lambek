import "dotenv/config";
import { PrismaClient, RoleType, PermissionType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { getConnectionString } from "../lib/db/connection";

const pool = new Pool({ connectionString: getConnectionString() });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@kongacoffee.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const permissions = await Promise.all(
    Object.values(PermissionType).map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: {
          name,
          description: `Permission to ${name.toLowerCase().replace(/_/g, " ")}`,
        },
      }),
    ),
  );

  const roleConfigs: { name: RoleType; permissions: PermissionType[] }[] = [
    { name: RoleType.SUPER_ADMIN, permissions: Object.values(PermissionType) },
    {
      name: RoleType.ADMIN,
      permissions: Object.values(PermissionType).filter(
        (p) => p !== PermissionType.MANAGE_USERS,
      ),
    },
    {
      name: RoleType.EDITOR,
      permissions: [
        PermissionType.MANAGE_JOURNAL,
        PermissionType.MANAGE_MEDIA,
        PermissionType.MANAGE_COFFEE,
      ],
    },
    {
      name: RoleType.SALES,
      permissions: [
        PermissionType.MANAGE_INQUIRIES,
        PermissionType.MANAGE_SAMPLES,
      ],
    },
  ];

  for (const config of roleConfigs) {
    const role = await prisma.role.upsert({
      where: { name: config.name },
      update: {},
      create: { name: config.name, description: `${config.name} role` },
    });

    for (const permName of config.permissions) {
      const perm = permissions.find((p) => p.name === permName);
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: perm.id },
          },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }

  const superAdminRole = await prisma.role.findUnique({
    where: { name: RoleType.SUPER_ADMIN },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Super Admin" },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Super Admin",
      active: true,
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id },
      },
      update: {},
      create: { userId: adminUser.id, roleId: superAdminRole.id },
    });
  }

  const origin = await prisma.coffeeOrigin.upsert({
    where: { slug: "yirgacheffe-gedeo" },
    update: {},
    create: {
      name: "Yirgacheffe / Gedeo",
      slug: "yirgacheffe-gedeo",
      country: "Ethiopia",
      region: "Southern Nations, Nationalities, and Peoples' Region",
      zone: "Gedeo Zone",
      description:
        "Lambek Coffee processes and exports Ethiopian Yirgacheffe green coffee beans from the Gedeo highlands.",
    },
  });

  const washed = await prisma.coffeeProcess.upsert({
    where: { slug: "washed" },
    update: {},
    create: {
      name: "Washed",
      slug: "washed",
      description: "Washed processing method.",
    },
  });

  const natural = await prisma.coffeeProcess.upsert({
    where: { slug: "natural" },
    update: {},
    create: {
      name: "Natural",
      slug: "natural",
      description: "Natural processing method.",
    },
  });

  const heirloom = await prisma.coffeeVariety.upsert({
    where: { slug: "heirloom" },
    update: {},
    create: {
      name: "Ethiopian Heirloom",
      slug: "heirloom",
      description: "Ethiopia has more than a thousand diversified coffee types.",
    },
  });

  const siteSettings = [
    { key: "company_name", value: "Lambek Coffee Ltd", group: "general" },
    {
      key: "tagline",
      value: "Where Traditions Meet Aroma",
      group: "general",
    },
    {
      key: "hero_headline",
      value: "WHERE TRADITIONS\nMEET AROMA",
      group: "hero",
    },
    {
      key: "hero_subtext",
      value:
        "Exceptional Ethiopian coffee, carefully processed and prepared for the world.",
      group: "hero",
    },
    {
      key: "emails",
      value: "info@Lambekcoffee.com\nKongacoffee153@gmail.com",
      group: "contact",
    },
    {
      key: "phones",
      value: "+251911210468\n+251911112156\n+251982980000",
      group: "contact",
    },
    { key: "address", value: "Ejigayhu Dibaba bldg, 5th Floor", group: "contact" },
    {
      key: "maps_url",
      value: "https://maps.app.goo.gl/qEWCGMyrrPZ6tNVe8",
      group: "contact",
    },
    {
      key: "working_hours",
      value: "Monday–Friday: 8:30 – 17:30",
      group: "contact",
    },
    {
      key: "about_text",
      value:
        "Lambek Coffee is a company set into action since April 2020 with primary objective of supplying speciality coffee directly from the farmers to the high end roasters across the globe. The management of LC is comprised with highly experienced people who have been working in the high end specialty coffee for over a decade. Lambek Coffee Ltd is a startup private limited company that is processor and exporter of Ethiopian Yirgacheffe green coffee beans from the Gedeo highlands. Our prime assets are our hardworking employees and the farmers around us.",
      group: "about",
    },
    {
      key: "values",
      value: JSON.stringify([
        "Create shared values",
        "Transparency across all the value chain",
        "Quality product and standard service",
      ]),
      group: "about",
    },
    {
      key: "services",
      value: JSON.stringify([
        "We process and export coffee from our farm as well as coffee from member farmers",
        "Provide Good Agricultural Practices to the farmers in our operation areas",
        "Involve in the local development activities within the context of our business",
      ]),
      group: "about",
    },
    {
      key: "seo_default_title",
      value: "Lambek Coffee | Ethiopian Yirgacheffe Green Coffee Exporter",
      group: "seo",
    },
    {
      key: "seo_default_description",
      value:
        "Lambek Coffee Ltd — processor and exporter of high quality, traceable Ethiopian Yirgacheffe green coffee from the Gedeo highlands.",
      group: "seo",
    },
    { key: "footer_text", value: "© Lambek Coffee Ltd. All rights reserved.", group: "footer" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  const demoCoffee = await prisma.coffee.upsert({
    where: { slug: "demo-yirgacheffe-washed" },
    update: {},
    create: {
      name: "[Demo] Yirgacheffe Washed",
      slug: "demo-yirgacheffe-washed",
      shortDescription:
        "Demonstration coffee record — replace with verified product data via admin.",
      description:
        "This is a demonstration coffee entry for CMS testing. Admin users should replace this with verified product information.",
      region: "Yirgacheffe",
      microRegion: "Gedeo",
      country: "Ethiopia",
      harvestPeriod: "Contact for availability",
      tastingNotes: ["Floral", "Citrus", "Tea-like"],
      featured: true,
      published: true,
      originId: origin.id,
      processId: washed.id,
      varietyId: heirloom.id,
      seoTitle: "[Demo] Yirgacheffe Washed | Lambek Coffee",
      seoDescription: "Demonstration coffee listing for Lambek Coffee CMS.",
    },
  });

  await prisma.coffeeProfile.upsert({
    where: { coffeeId: demoCoffee.id },
    update: {},
    create: {
      coffeeId: demoCoffee.id,
      body: "Medium",
      acidity: "Bright",
      sweetness: "Delicate",
      aroma: "Floral",
      finish: "Clean",
    },
  });

  await prisma.coffeeAvailability.create({
    data: {
      coffeeId: demoCoffee.id,
      status: "AVAILABLE",
      notes: "Demonstration availability status",
    },
  }).catch(() => undefined);

  await prisma.coffeeLot.upsert({
    where: { lotId: "DEMO-2024-001" },
    update: {},
    create: {
      lotId: "DEMO-2024-001",
      coffeeId: demoCoffee.id,
      harvest: "Demo harvest period",
      cupProfile: "Demonstration cup profile — admin editable",
      notes: "This is a demonstration lot for traceability testing.",
      published: true,
    },
  });

  const category = await prisma.journalCategory.upsert({
    where: { slug: "origin-stories" },
    update: {},
    create: {
      name: "Origin Stories",
      slug: "origin-stories",
      description: "Stories from the Gedeo highlands and beyond.",
    },
  });

  await prisma.journalPost.upsert({
    where: { slug: "welcome-to-konga-coffee-journal" },
    update: {},
    create: {
      title: "Welcome to the Lambek Coffee Journal",
      slug: "welcome-to-konga-coffee-journal",
      excerpt:
        "Editorial content about Ethiopian coffee origin, processing, and quality — managed through the admin CMS.",
      content: `<p>Lambek Coffee Ltd is a processor and exporter of Ethiopian Yirgacheffe green coffee beans from the Gedeo highlands, established in April 2020.</p><p>This journal will share verified stories about our origin, processing methods, and commitment to quality and transparency across the value chain.</p>`,
      categoryId: category.id,
      authorId: adminUser.id,
      featured: true,
      published: true,
      publishedAt: new Date(),
      readingTime: 2,
      seoTitle: "Welcome to the Lambek Coffee Journal",
      seoDescription:
        "Editorial content about Ethiopian coffee from Lambek Coffee Ltd.",
    },
  });

  console.log("Seed completed successfully");
  console.log(`Admin login: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
