import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-foreground/70">{description}</p>
      )}
    </div>
  );
}

export function CTASection({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-primary px-6 py-20 text-primary-foreground md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-4xl md:text-5xl">{title}</h2>
        {description && <p className="mt-4 text-lg text-primary-foreground/80">{description}</p>}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={primaryHref}
            className="inline-flex h-11 items-center bg-secondary px-8 text-sm font-medium uppercase tracking-wide text-secondary-foreground transition hover:bg-secondary/90"
          >
            {primaryLabel}
          </a>
          {secondaryHref && secondaryLabel && (
            <a
              href={secondaryHref}
              className="inline-flex h-11 items-center border border-primary-foreground/30 px-8 text-sm font-medium uppercase tracking-wide transition hover:bg-primary-foreground/10"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
