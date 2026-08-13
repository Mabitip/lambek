import { buildMetadata } from "@/lib/seo/metadata";
import { DEFAULT_CONTACT } from "@/lib/constants/contact";
import { BRAND } from "@/lib/constants/brand";
import { settingsService, coffeeService } from "@/lib/services/coffee.service";
import { ContactDetails } from "@/components/layout/ContactDetails";
import { ContactFormsTabs } from "@/components/forms/ContactFormsTabs";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `Contact ${BRAND.legalName} — ${DEFAULT_CONTACT.primaryEmail}, ${DEFAULT_CONTACT.phones[0]}, ${DEFAULT_CONTACT.address}, Addis Ababa.`,
  path: "/contact",
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultCoffeeSlug = typeof params.coffee === "string" ? params.coffee : undefined;

  const [contact, coffees] = await Promise.all([
    settingsService.getContactInfo(),
    coffeeService
      .getPublished({ page: 1, limit: 50 })
      .then((r) => r.items.map((c) => ({ id: c.id, name: c.name, slug: c.slug })))
      .catch(() => []),
  ]);

  return (
    <>
      <section className="bg-primary px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-semibold md:text-6xl">Contact Us</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Get in touch for green coffee inquiries, samples, or general questions. We respond promptly.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-primary">Get in Touch</h2>
            <div className="mt-8">
              <ContactDetails contact={contact} variant="page" showHours />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <ContactFormsTabs coffees={coffees} defaultCoffeeSlug={defaultCoffeeSlug} />
          </div>
        </div>
      </section>
    </>
  );
}
