import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, Sparkles } from "lucide-react";
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

  const related = await journalService.getRelated(post.id, post.categoryId ?? post.category?.id);
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
        {/* Article Hero Banner */}
        <div className="page-hero-shell relative min-h-[460px] overflow-hidden bg-[#0B1E15] px-6 pt-32 pb-16 text-white md:min-h-[520px] md:pb-24">
          {post.coverImage?.url && (
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover opacity-35 scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E15] via-[#0B1E15]/80 to-transparent" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md transition hover:border-secondary hover:text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>

            {post.category && (
              <div>
                <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground shadow-md">
                  {post.category.name}
                </span>
              </div>
            )}

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs uppercase tracking-wider text-white/70">
              {post.author && (
                <span className="font-semibold text-secondary">
                  By {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                  <time>{formatDate(post.publishedAt)}</time>
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-secondary" />
                  <span>{post.readingTime} min read</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          {post.excerpt && (
            <p className="rounded-2xl border-l-4 border-secondary bg-card p-6 font-serif text-lg italic leading-relaxed text-foreground/80 shadow-sm sm:text-xl">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose-konga mt-10 text-foreground/85"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
              <span className="mr-2 text-xs font-semibold uppercase tracking-widest text-foreground/50">Topics:</span>
              {post.tags.map(({ tag }: any) => (
                <span
                  key={tag.id || tag.name}
                  className="rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground/80 shadow-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="border-t border-border bg-[#F8F9F5] dark:bg-[#0B1E15] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Continue Reading</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">Related Origin Stories</h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-secondary"
              >
                All Articles →
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r: any) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-lg"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                    {r.category?.name ?? "Article"}
                  </span>
                  <h3 className="mt-2 font-serif text-lg font-bold text-primary transition group-hover:text-secondary">
                    {r.title}
                  </h3>
                  {r.excerpt && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground/70">
                      {r.excerpt}
                    </p>
                  )}
                  <span className="mt-4 text-xs font-semibold text-secondary">
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
