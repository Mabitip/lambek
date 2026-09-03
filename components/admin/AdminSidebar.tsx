import Link from "next/link";
import { signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  Coffee,
  BookOpen,
  Mail,
  Package,
  Image,
  Users,
  Settings,
  LogOut,
  MapPin,
  Layers,
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
  { href: "/admin/journal", label: "Journal", icon: BookOpen },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/sample-requests", label: "Sample Requests", icon: Package },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <Link href="/admin/dashboard" className="flex items-center justify-between gap-2">
          <OptimizedImage
            src={SITE_IMAGES.logoDarkGreen}
            alt={BRAND.name}
            width={130}
            height={38}
            className="logo-on-light h-8 w-auto object-contain"
          />
          <OptimizedImage
            src={SITE_IMAGES.logoWhite}
            alt={BRAND.name}
            width={130}
            height={38}
            className="logo-on-dark h-8 w-auto object-contain"
          />
          <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            Admin
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/70 transition hover:bg-muted/30 hover:text-primary"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center justify-between px-3">
          <span className="text-xs uppercase tracking-wider text-foreground/50">Theme</span>
          <ThemeToggle />
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-foreground/70 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

export function StatsCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number | string;
  href?: string;
}) {
  const content = (
    <div className="border border-border bg-card p-6">
      <p className="text-xs uppercase tracking-wider text-foreground/50">{title}</p>
      <p className="mt-2 font-serif text-4xl text-primary">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
