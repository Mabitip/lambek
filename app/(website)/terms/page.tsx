import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: `${BRAND.name} terms of use.`,
  path: "/terms",
  noIndex: true,
});

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl">Terms of Use</h1>
      <div className="prose-konga mt-8 space-y-4 text-foreground/80">
        <p>
          By using the {BRAND.name} website, you agree to these terms. Content on this website is provided for informational purposes about our green coffee products and services.
        </p>
        <p>
          Coffee availability, pricing, and specifications are subject to change. All business inquiries are handled on a case-by-case basis.
        </p>
        <p>
          For questions, contact info@Lambekcoffee.com or Kongacoffee153@gmail.com.
        </p>
      </div>
    </section>
  );
}
