import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/lib/seo/json-ld";
import { journalService } from "@/lib/services/content.service";
import { formatDate, getSiteUrl } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await journalService.getBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? `${BRAND.name} blog.`,
    path: `/blog/${slug}`,
    type: "article",
    image: post.coverImage?.url,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await journalService.getBySlug(slug);
  if (!post) notFound();

  const related = await journalService.getRelated(post.id, post.categoryId);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Blog", url: `${siteUrl}/blog` },
            { name: post.title, url: `${siteUrl}/blog/${slug}` },
          ]),
        ]}
      />

      <article>
        {post.coverImage && (
          <div className="page-hero-shell relative h-[50vh] min-h-[400px]">
            <Image src={post.coverImage.url} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-16">
          {post.category && <Badge variant="gold">{post.category.name}</Badge>}
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm uppercase tracking-wider text-foreground/50">
            {post.author && <span>{post.author.name}</span>}
            {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>
          {post.excerpt && (
            <p className="mt-6 text-xl leading-relaxed text-foreground/70">{post.excerpt}</p>
          )}
          <div
            className="prose-konga mt-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
              {post.tags.map(({ tag }) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-card px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-semibold">Related Stories</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <h3 className="text-xl font-medium group-hover:text-primary">{r.title}</h3>
                  {r.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{r.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
