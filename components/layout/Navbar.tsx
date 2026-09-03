"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, X } from "lucide-react";
import { NAV_LINKS, MOBILE_MORE_LINKS, BRAND } from "@/lib/constants/brand";
import { SITE_IMAGES } from "@/lib/constants/images";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const DESKTOP_LINKS = NAV_LINKS.filter((link) => link.href !== "/contact");

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHome = pathname === "/";
  const showTransparent = isHome && !scrolled;
  const barState = showTransparent ? "is-clear" : "is-solid";

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="site-header">
        <div className={cn("site-header-bar", barState)}>
          <Link href="/" className="site-logo flex items-center"> 
            {showTransparent ? (
              <OptimizedImage
                src={SITE_IMAGES.logoWhite}
                alt={BRAND.name}
                width={170}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <>
                <OptimizedImage
                  src={SITE_IMAGES.logoDarkGreen}
                  alt={BRAND.name}
                  width={170}
                  height={50}
                  className="logo-on-light h-10 w-auto object-contain"
                  priority
                />
                <OptimizedImage
                  src={SITE_IMAGES.logoWhite}
                  alt={BRAND.name}
                  width={170}
                  height={50}
                  className="logo-on-dark h-10 w-auto object-contain"
                  priority
                />
              </>
            )}
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {DESKTOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn("site-nav-link", isActive(link.href) && "is-active")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <ThemeToggle variant={showTransparent ? "headerTransparent" : "header"} />
            </div>
            <Link href="/contact" className="site-header-cta">
              Contact
            </Link>
            <button
              type="button"
              className={cn(
                "header-glass-btn lg:hidden",
                showTransparent ? "border-white/30 text-white" : "text-primary",
              )}
              onClick={() => setOpen(true)}
              aria-label="Open more menu"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-md lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="fixed inset-y-0 right-0 z-[120] flex w-[min(100%,20rem)] flex-col rounded-l-3xl border-l border-border bg-card/95 shadow-2xl backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-2">
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
              </div>
              <button
                type="button"
                className="header-glass-btn text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-4">
              {MOBILE_MORE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-2xl px-4 py-3.5 text-sm font-medium uppercase tracking-widest transition",
                    isActive(link.href)
                      ? "bg-secondary/20 text-primary"
                      : "text-foreground/70 hover:bg-muted/40 hover:text-primary",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-4 border-t border-border px-6 py-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-foreground/50">Appearance</p>
                <ThemeToggle variant="header" className="h-11 w-11" />
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase tracking-widest text-primary-foreground"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
