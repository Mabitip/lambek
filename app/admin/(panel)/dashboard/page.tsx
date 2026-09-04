import Link from "next/link";
import {
  Coffee,
  Mail,
  Package,
  BookOpen,
  Users,
  UserCheck,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Eye,
  Shield,
} from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { StatsCard } from "@/components/admin/AdminSidebar";
import { DashboardCharts, buildChartData } from "@/components/admin/DashboardCharts";
import { formatDate } from "@/lib/utils/cn";

export default async function AdminDashboardPage() {
  const session = await requireAuth();

  const [
    totalCoffees,
    publishedCoffees,
    totalInquiries,
    unreadInquiries,
    totalMessages,
    unreadMessages,
    totalSamples,
    pendingSamples,
    totalPosts,
    totalUsers,
    totalSubscribers,
    recentInquiries,
    recentMessages,
    recentSamples,
    recentLogs,
  ] = await Promise.all([
    prisma.coffee.count().catch(() => 0),
    prisma.coffee.count({ where: { published: true } }).catch(() => 0),
    prisma.inquiry.count().catch(() => 0),
    prisma.inquiry.count({ where: { read: false } }).catch(() => 0),
    prisma.contactMessage.count().catch(() => 0),
    prisma.contactMessage.count({ where: { read: false } }).catch(() => 0),
    prisma.sampleRequest.count().catch(() => 0),
    prisma.sampleRequest.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.journalPost.count().catch(() => 0),
    prisma.user.count().catch(() => 0),
    prisma.newsletterSubscriber.count().catch(() => 0),
    prisma.inquiry.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { coffee: true },
    }).catch(() => []),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    prisma.sampleRequest.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { coffee: true },
    }).catch(() => []),
    prisma.activityLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }).catch(() => []),
  ]);

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const [chartInquiries, chartSamples] = await Promise.all([
    prisma.inquiry.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }).catch(() => []),
    prisma.sampleRequest.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    }).catch(() => []),
  ]);

  const chartData = buildChartData(chartInquiries, chartSamples);

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {session.user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is a snapshot of your export catalog, buyer requests, and CMS activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/coffees/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Coffee
          </Link>
          <Link
            href="/admin/journal/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-sm"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Write Article
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-sm"
          >
            <Mail className="h-3.5 w-3.5" />
            View Leads
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Trade Inquiries"
          value={totalInquiries}
          subtitle={unreadInquiries > 0 ? `${unreadInquiries} unread` : "All caught up"}
          href="/admin/inquiries"
          icon={Coffee}
        />
        <StatsCard
          title="Sample Requests"
          value={totalSamples}
          subtitle={pendingSamples > 0 ? `${pendingSamples} pending` : "No pending"}
          href="/admin/inquiries"
          icon={Package}
        />
        <StatsCard
          title="Contact Messages"
          value={totalMessages}
          subtitle={unreadMessages > 0 ? `${unreadMessages} unread` : "All read"}
          href="/admin/inquiries"
          icon={Mail}
        />
        <StatsCard
          title="Catalog Coffees"
          value={totalCoffees}
          subtitle={`${publishedCoffees} published`}
          href="/admin/coffees"
          icon={Coffee}
        />
        <StatsCard
          title="Journal Articles"
          value={totalPosts}
          subtitle="Blog & Stories"
          href="/admin/journal"
          icon={BookOpen}
        />
        <StatsCard
          title="Admin Users"
          value={totalUsers}
          subtitle={`${totalSubscribers} subscribers`}
          href="/admin/users"
          icon={Users}
        />
      </div>

      {/* Analytics Chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Inquiry & Sample Request Velocity
            </h2>
            <p className="text-xs text-muted-foreground">30-day activity volume trend</p>
          </div>
        </div>
        <DashboardCharts data={chartData} />
      </div>

      {/* Recent Leads Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Inquiries & Messages */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground">Latest Inbound Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm">{inq.fullName}</p>
                    {inq.company && (
                      <span className="text-xs text-muted-foreground">({inq.company})</span>
                    )}
                    {!inq.read && (
                      <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {inq.requestType?.replace(/_/g, " ")} {inq.coffee?.name ? `· ${inq.coffee.name}` : ""}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground/70">
                  {formatDate(inq.createdAt)}
                </span>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">No inquiries yet.</p>
            )}
          </div>
        </div>

        {/* Recent Sample Requests */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground">Sample Orders</h2>
            <Link
              href="/admin/inquiries"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View Pipeline <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSamples.map((sample) => (
              <div
                key={sample.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition hover:border-primary/40"
              >
                <div>
                  <p className="font-semibold text-foreground text-sm">{sample.company}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sample.name} {sample.coffee?.name ? `· ${sample.coffee.name}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    sample.status === "PENDING"
                      ? "bg-amber-500/10 text-amber-600"
                      : sample.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-blue-500/10 text-blue-600"
                  }`}
                >
                  {sample.status}
                </span>
              </div>
            ))}
            {recentSamples.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">No sample requests yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Logs Stream */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-bold text-foreground">Audit & Activity Log</h2>
          </div>
        </div>

        <div className="space-y-2 divide-y divide-border">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between pt-2.5 pb-1 text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-1.5 py-0.5 font-bold uppercase tracking-wider ${
                    log.action === "CREATE"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : log.action === "UPDATE"
                      ? "bg-blue-500/10 text-blue-600"
                      : log.action === "DELETE"
                      ? "bg-rose-500/10 text-rose-600"
                      : "bg-purple-500/10 text-purple-600"
                  }`}
                >
                  {log.action}
                </span>
                <span className="font-medium text-foreground">{log.details || log.entityType}</span>
                <span className="text-muted-foreground">by {log.user?.name || "System"}</span>
              </div>
              <span className="text-muted-foreground/70">{formatDate(log.createdAt)}</span>
            </div>
          ))}
          {recentLogs.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">No activity logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
