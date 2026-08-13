"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Home, Mail } from "lucide-react";
import { MOBILE_BOTTOM_NAV } from "@/lib/constants/brand";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  home: Home,
  coffee: Coffee,
  mail: Mail,
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-bottom-nav lg:hidden"
      aria-label="Primary mobile navigation"
    >
      {MOBILE_BOTTOM_NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = ICONS[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn("mobile-tab", active && "mobile-tab-active")}
          >
            {active && <span className="mobile-tab-indicator" aria-hidden />}
            <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
            <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
