"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Coffee,
  BookOpen,
  Mail,
  Image,
  Users,
  Settings,
  LogOut,
  MapPin,
  Layers,
  MessageSquareQuote,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BRAND } from "@/lib/constants/brand";
import { SITE_IMAGES } from "@/lib/constants/images";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/coffees", label: "Coffees", icon: Coffee },
  { href: "/admin/origins", label: "Origins", icon: MapPin },
  { href: "/admin/processes", label: "Processes", icon: Layers },
  { href: "/admin/journal", label: "Journal / Blog", icon: BookOpen },
  { href: "/admin/inquiries", label: "Contacts & Inquiries", icon: Mail },
  { href: "/admin/testimonials", label: "Testimonials & Partners", icon: MessageSquareQuote },
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/users", label: "Users & Roles", icon: Users },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar({
  user,
}: {
  user?: { name?: string | null; email?: string | null; roles?: string[] };
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-card text-card-foreground shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <OptimizedImage
            src={SITE_IMAGES.logoDarkGreen}
            alt={BRAND.name}
            width={110}
            height={32}
            className="logo-on-light h-7 w-auto object-contain"
          />
          <OptimizedImage
            src={SITE_IMAGES.logoWhite}
            alt={BRAND.name}
            width={110}
            height={32}
            className="logo-on-dark h-7 w-auto object-contain"
          />
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info & Footer Actions */}
      <div className="border-t border-border p-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-muted/40">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.roles?.join(", ") || user.email}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Site</span>
          </Link>
          <ThemeToggle />
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function StatsCard({
  title,
  value,
  href,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  href?: string;
  subtitle?: string;
  icon?: any;
}) {
  const content = (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary transition group-hover:scale-110">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="mt-3 font-serif text-3xl font-bold text-primary lg:text-4xl">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
