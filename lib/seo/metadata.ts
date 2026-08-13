import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/cn";
import { resolveContactInfo } from "@/lib/constants/contact";
import { BRAND } from "@/lib/constants/brand";

interface PageMetaOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildMetadata(options: PageMetaOptions): Metadata {
  const siteUrl = getSiteUrl();
  const url = options.path ? `${siteUrl}${options.path}` : siteUrl;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? BRAND.name;

  return {
    title: options.title,
    description: options.description,
    alternates: { canonical: url },
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName,
      type: options.type ?? "website",
      ...(options.image && { images: [{ url: options.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      ...(options.image && { images: [options.image] }),
    },
    ...(options.noIndex && { robots: { index: false, follow: false } }),
  };
}

export function organizationJsonLd(settings?: Record<string, string>) {
  const contact = resolveContactInfo(settings);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.company_name ?? BRAND.legalName,
    url: getSiteUrl(),
    email: contact.primaryEmail,
    telephone: contact.phones,
    hasMap: contact.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    description:
      settings?.seo_default_description ??
      "Processor and exporter of Ethiopian Yirgacheffe green coffee from the Gedeo highlands.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? BRAND.name,
    url: getSiteUrl(),
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  publishedAt?: Date | null;
  author?: { name: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${getSiteUrl()}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
  };
}

export function productJsonLd(coffee: {
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  country?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: coffee.name,
    description: coffee.shortDescription ?? coffee.description,
    url: `${getSiteUrl()}/coffee/${coffee.slug}`,
    category: "Green Coffee",
    countryOfOrigin: coffee.country ?? "Ethiopia",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}