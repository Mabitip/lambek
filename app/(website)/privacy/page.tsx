import { buildMetadata } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/constants/brand";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `${BRAND.name} privacy policy.`,
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl">Privacy Policy</h1>
      <div className="prose-konga mt-8 space-y-4 text-foreground/80">
        <p>
          {BRAND.legalName} respects your privacy. Information collected through contact forms, inquiry forms, and sample requests is used solely to respond to your requests and manage business relationships.
        </p>
        <p>
          We do not sell or share your personal information with third parties except as required to fulfill your requests or as required by law.
        </p>
        <p>
          For questions about this policy, contact us at info@Lambekcoffee.com or Kongacoffee153@gmail.com.
        </p>
      </div>
    </section>
  );
}
