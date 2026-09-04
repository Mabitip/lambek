import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { journalService } from "@/lib/services/content.service";
import { formatDate } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SITE_IMAGES } from "@/lib/constants/images";

export const metadata = buildMetadata({
  title: "Blog & Coffee Journal | Ethiopian Origin Stories",
  description: `Read stories on Ethiopian green coffee origin, washed processing methods, and coffee heritage from ${BRAND.name}.`,
  path: "/blog",
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCat = typeof params.category === "string" ? params.category : undefined;

  const { items, totalPages, page } = await journalService
    .getPublished({
      search: typeof params.search === "string" ? params.search : undefined,
      category: currentCat,
      page: typeof params.page === "string" ? Number(params.page) : 1,
    })
    .catch(() => ({ items: [], totalPages: 0, page: 1, total: 0, limit: 12 }));

  const categories = await journalService.getCategories().catch(() => []);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="page-hero-shell relative flex min-h-[460px] items-end overflow-hidden bg-[#0B1E15] px-6 pb-16 pt-32 text-white sm:min-h-[500px] md:pb-20">
        <OptimizedImage
          src={SITE_IMAGES.hero}
          alt="Ethiopian coffee highlands"
          fill
          priority
          sizes="100vw"
          variant="hero"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E15] via-[#0B1E15]/80 to-[#0B1E15]/30" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-secondary/40 bg-black/50 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Origin Editorial & Articles
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Coffee Journal & Articles
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            Insightful articles exploring Ethiopian specialty coffee — from cherry harvesting and washed processing science to market valuation and origin traditions.
          </p>
        </div>
      </section>

      {/* 2. MAIN BLOG CONTENT */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter Pills */}
          <div className="mb-14 flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/blog"
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                !currentCat
                  ? "bg-[#143525] text-white shadow-md ring-2 ring-secondary/50"
                  : "border border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
              }`}
            >
              All Articles
            </Link>
            {categories.map((cat) => {
              const isActive = currentCat === cat.slug;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-[#143525] text-white shadow-md ring-2 ring-secondary/50"
                      : "border border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
              <p className="font-serif text-2xl font-semibold text-primary">No articles found</p>
              <p className="mt-2 text-foreground/60">Check back soon for new stories from the Gedeo highlands.</p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
              {items.map((post: any) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {post.coverImage?.url ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary/10">
                        <span className="text-2xl font-semibold text-primary/30">{BRAND.wordmark}</span>
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-[#143525]/90 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-8">
                    <div>
                      <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-foreground/50">
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

                      <h2 className="mt-4 font-serif text-2xl font-bold leading-snug text-primary transition group-hover:text-secondary sm:text-3xl">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {post.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-5">
                      {post.author ? (
                        <span className="text-xs font-semibold text-foreground/60">
                          By {post.author.name}
                        </span>
                      ) : <span />}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#143525] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-secondary hover:text-secondary-foreground"
                      >
                        Read More
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold transition ${
                    p === page
                      ? "bg-[#143525] text-white shadow-md ring-2 ring-secondary"
                      : "border border-border bg-card text-foreground/70 hover:border-secondary hover:text-primary"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
