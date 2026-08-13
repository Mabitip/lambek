import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";
import { coffeeService } from "@/lib/services/coffee.service";
import { SectionHeading } from "@/components/ui/section-heading";
import { CoffeeGrid } from "@/components/coffee/CoffeeCard";
import { CoffeeFilter } from "@/components/coffee/CoffeeFilter";
import { TraceabilitySearch } from "@/components/coffee/TraceabilitySearch";

export const metadata = buildMetadata({
  title: "Coffee",
  description: `Explore ${BRAND.name}'s selection of Ethiopian Yirgacheffe green coffee — filter by origin, process, variety, and availability.`,
  path: "/coffee",
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CoffeePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = {
    origin: typeof params.origin === "string" ? params.origin : undefined,
    process: typeof params.process === "string" ? params.process : undefined,
    variety: typeof params.variety === "string" ? params.variety : undefined,
    availability: typeof params.availability === "string" ? params.availability : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
  };

  const [{ items, totalPages, page }, filterOptions] = await Promise.all([
    coffeeService.getPublished(filters).catch(() => ({ items: [], totalPages: 0, page: 1, total: 0, limit: 12 })),
    coffeeService.getFilterOptions().catch(() => ({ origins: [], processes: [], varieties: [] })),
  ]);

  return (
    <>
      <section className="bg-primary px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold md:text-6xl">Coffee</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Ethiopian Yirgacheffe green coffee from the Gedeo highlands — explore our current offerings.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<div className="mb-10 h-32 animate-pulse bg-muted" />}>
            <CoffeeFilter
              origins={filterOptions.origins.map((o) => ({ slug: o.slug, name: o.name }))}
              processes={filterOptions.processes.map((p) => ({ slug: p.slug, name: p.name }))}
              varieties={filterOptions.varieties.map((v) => ({ slug: v.slug, name: v.name }))}
            />
          </Suspense>
          <CoffeeGrid coffees={items} />
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/coffee?page=${p}`}
                  className={`flex h-10 w-10 items-center justify-center border text-sm ${
                    p === page ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Coffee Lot Traceability"
            description="Search by lot ID, coffee name, origin, or process to view your coffee passport."
            align="center"
          />
          <TraceabilitySearch />
        </div>
      </section>
    </>
  );
}
