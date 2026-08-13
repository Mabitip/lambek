import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DEFAULT_CONTACT } from "@/lib/constants/contact";
import { SectionHeading } from "@/components/ui/section-heading";

export function LocationMapSection() {
  return (
    <section className="border-t border-border bg-card px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Visit Us"
          title="Find Us"
          description={DEFAULT_CONTACT.address}
          align="center"
        />
        <div className="media-frame media-frame-lg mx-auto mt-10 max-w-5xl overflow-hidden">
          <iframe
            src={DEFAULT_CONTACT.mapsEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Lambek Coffee location on Google Maps"
            className="min-h-[320px] w-full sm:min-h-[450px]"
          />
        </div>
        <div className="mt-6 text-center">
          <Link
            href={DEFAULT_CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary transition hover:text-secondary"
          >
            Open in Google Maps
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
