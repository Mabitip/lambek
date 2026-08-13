import Link from "next/link";
import { MapPin, Mail, Phone, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ContactInfo } from "@/lib/constants/contact";

interface ContactDetailsProps {
  contact: ContactInfo;
  variant?: "footer" | "page";
  showHours?: boolean;
  className?: string;
}

export function ContactDetails({
  contact,
  variant = "page",
  showHours = false,
  className,
}: ContactDetailsProps) {
  const isFooter = variant === "footer";

  const linkClass = isFooter
    ? "transition hover:text-secondary"
    : "text-primary transition hover:text-secondary";

  const textClass = isFooter ? "text-[var(--footer-muted)]" : "text-foreground";

  if (isFooter) {
    return (
      <ul className={cn("space-y-4 text-sm", textClass, className)}>
        <li className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
          <a
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {contact.address}
          </a>
        </li>
        <li className="flex gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
          <div className="space-y-1">
            {contact.emails.map((email) => (
              <a key={email} href={`mailto:${email}`} className={cn("block", linkClass)}>
                {email}
              </a>
            ))}
          </div>
        </li>
        <li className="flex gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
          <div className="space-y-1">
            {contact.phones.map((phone) => (
              <a key={phone} href={`tel:${phone}`} className={cn("block", linkClass)}>
                {phone}
              </a>
            ))}
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <p className="text-xs uppercase tracking-widest text-foreground/50">Address</p>
        <a
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("mt-1 inline-flex items-center gap-1.5 text-lg", linkClass)}
        >
          {contact.address}
          <ExternalLink className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        </a>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-foreground/50">Email</p>
        <div className="mt-1 space-y-1">
          {contact.emails.map((email) => (
            <a key={email} href={`mailto:${email}`} className={cn("block text-lg", linkClass)}>
              {email}
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-foreground/50">Phone</p>
        <div className="mt-1 space-y-1">
          {contact.phones.map((phone) => (
            <a key={phone} href={`tel:${phone}`} className={cn("block text-lg", linkClass)}>
              {phone}
            </a>
          ))}
        </div>
      </div>

      {showHours && (
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Working Hours
          </p>
          <p className="mt-1 text-lg">{contact.workingHours}</p>
        </div>
      )}

      <Link
        href={contact.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary transition hover:text-secondary"
      >
        View on Google Maps
        <ExternalLink className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
