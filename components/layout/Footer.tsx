import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FOOTER_NAV_LINKS, BRAND } from "@/lib/constants/brand";
import { resolveContactInfo } from "@/lib/constants/contact";
import { ContactDetails } from "@/components/layout/ContactDetails";
import { FooterThemeToggle } from "@/components/layout/FooterThemeToggle";

interface FooterProps {
  settings?: Record<string, string>;
}

export function Footer({ settings = {} }: FooterProps) {
  const contact = resolveContactInfo(settings);
  const footerText = settings.footer_text ?? `© ${BRAND.legalName}. All rights reserved.`;
  const tagline = settings.tagline ?? BRAND.tagline;

  return (
    <footer className="mobile-safe-pb mt-auto border-t border-secondary/30 bg-[var(--footer-bg)] text-[var(--footer-fg)] lg:pb-0">
      <div className="hidden border-b border-[var(--footer-border)] bg-primary px-6 py-12 text-primary-foreground lg:block md:py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Partner With Us</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              Ethiopian green coffee, traceable from farm to roastery
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center gap-2 bg-secondary px-6 text-sm font-medium uppercase tracking-wide text-secondary-foreground transition hover:bg-secondary/90"
          >
            Contact Us
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block text-3xl font-semibold tracking-[0.2em]">
              {BRAND.wordmark}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--footer-muted)]">
              {tagline}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 border border-secondary/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-secondary">
              Gedeo Zone · Yirgacheffe · Ethiopia
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-5 text-xs uppercase tracking-[0.25em] text-secondary">Navigate</p>
            <ul className="space-y-3">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--footer-muted)] transition hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="mb-5 text-xs uppercase tracking-[0.25em] text-secondary">Contact</p>
            <ContactDetails contact={contact} variant="footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--footer-border)] px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-[var(--footer-muted)] md:flex-row">
          <p>{footerText}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy" className="transition hover:text-secondary">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-secondary">
              Terms
            </Link>
            <FooterThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
