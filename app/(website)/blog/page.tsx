import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { journalService } from "@/lib/services/content.service";
import { formatDate } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

export const metadata = buildMetadata({
  title: "Blog",
  description: `Stories about Ethiopian coffee origin, processing, and quality from ${BRAND.name}.`,
  path: "/blog",
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { items, totalPages, page } = await journalService
    .getPublished({
      search: typeof params.search === "string" ? params.search : undefined,
      category: typeof params.category === "string" ? params.category : undefined,
      page: typeof params.page === "string" ? Number(params.page) : 1,
    })
    .catch(() => ({ items: [], totalPages: 0, page: 1, total: 0, limit: 12 }));

  const categories = await journalService.getCategories().catch(() => []);

  return (
    <>
      <section className="bg-primary px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold md:text-6xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Editorial stories about origin, processing, and the people behind our coffee.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap gap-3">
            <Link href="/blog" className="text-sm uppercase tracking-wider text-primary">
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="text-sm uppercase tracking-wider text-foreground/60 hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="border border-dashed border-border py-20 text-center">
              <p className="text-2xl font-semibold">No posts yet</p>
              <p className="mt-2 text-foreground/60">Check back soon for new stories.</p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <article key={post.id} className="media-card group">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary/10">
                        <span className="text-2xl font-semibold text-primary/30">{BRAND.wordmark}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && <Badge variant="gold">{post.category.name}</Badge>}
                    <h2 className="mt-3 text-2xl font-semibold group-hover:text-primary">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-foreground/70">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-wider text-foreground/50">
                      {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
                      {post.readingTime && <span>{post.readingTime} min read</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`flex h-10 w-10 items-center justify-center border ${
                    p === page ? "border-primary bg-primary text-primary-foreground" : "border-border"
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
