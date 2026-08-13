import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { getSiteUrl } from "@/lib/utils/cn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes = ["", "/about", "/gallery", "/blog", "/coffee", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  let coffeeRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const [coffees, posts] = await Promise.all([
      prisma.coffee.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.journalPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    coffeeRoutes = coffees.map((c) => ({
      url: `${baseUrl}/coffee/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    blogRoutes = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Database may not be available at build time
  }

  return [...staticRoutes, ...coffeeRoutes, ...blogRoutes];
}
