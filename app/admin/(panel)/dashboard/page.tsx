import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { dashboardService } from "@/lib/services/content.service";
import { StatsCard } from "@/components/admin/AdminSidebar";
import { StatusBadge } from "@/components/ui/badge";
import { DashboardCharts, buildChartData } from "@/components/admin/DashboardCharts";
import { formatDate } from "@/lib/utils/cn";

export default async function AdminDashboardPage() {
  await requireAuth();
  const [stats, activity, chartRaw] = await Promise.all([
    dashboardService.getStats().catch(() => ({
      totalCoffees: 0,
      publishedCoffees: 0,
      sampleRequests: 0,
      inquiries: 0,
      journalPosts: 0,
      subscribers: 0,
    })),
    dashboardService.getRecentActivity().catch(() => ({
      samples: [],
      inquiries: [],
      posts: [],
      logs: [],
    })),
    dashboardService.getChartData(30).catch(() => ({ inquiries: [], samples: [] })),
  ]);

  const chartData = buildChartData(chartRaw.inquiries, chartRaw.samples);

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Coffees" value={stats.totalCoffees} href="/admin/coffees" />
        <StatsCard title="Published Coffees" value={stats.publishedCoffees} href="/admin/coffees" />
        <StatsCard title="Sample Requests" value={stats.sampleRequests} href="/admin/sample-requests" />
        <StatsCard title="Coffee Inquiries" value={stats.inquiries} href="/admin/inquiries" />
        <StatsCard title="Journal Posts" value={stats.journalPosts} href="/admin/journal" />
        <StatsCard title="Newsletter Subscribers" value={stats.subscribers} />
      </div>

      <div className="mt-12">
        <DashboardCharts data={chartData} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-xl">Latest Sample Requests</h2>
          <div className="space-y-3">
            {activity.samples.length === 0 ? (
              <p className="text-sm text-foreground/50">No sample requests yet.</p>
            ) : (
              activity.samples.map((s) => (
                <div key={s.id} className="flex items-center justify-between border border-border bg-card p-4">
                  <div>
                    <p className="font-medium">{s.company}</p>
                    <p className="text-xs text-foreground/50">{formatDate(s.createdAt)}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl">Latest Inquiries</h2>
          <div className="space-y-3">
            {activity.inquiries.length === 0 ? (
              <p className="text-sm text-foreground/50">No inquiries yet.</p>
            ) : (
              activity.inquiries.map((i) => (
                <div key={i.id} className="border border-border bg-card p-4">
                  <p className="font-medium">{i.fullName}</p>
                  <p className="text-sm text-foreground/60">{i.requestType.replace(/_/g, " ")}</p>
                  <p className="text-xs text-foreground/50">{formatDate(i.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {activity.posts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-xl">Latest Journal Posts</h2>
          <div className="space-y-2">
            {activity.posts.map((p) => (
              <div key={p.id} className="border border-border bg-card p-4">
                <Link href={`/admin/journal/${p.id}`} className="font-medium hover:text-primary">
                  {p.title}
                </Link>
                <p className="text-xs text-foreground/50">{formatDate(p.updatedAt)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <Link href="/admin/coffees/new" className="text-sm text-primary hover:text-secondary">
          + Add New Coffee
        </Link>
      </div>
    </div>
  );
}
