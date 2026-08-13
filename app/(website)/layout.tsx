import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { settingsService } from "@/lib/services/coffee.service";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/json-ld";

export default async function WebsiteLayout({ children }: LayoutProps<"/">) {
  const settings = await settingsService.getAll().catch(() => ({}));

  return (
    <>
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd()]} />
      <Navbar />
      <main className="mobile-safe-pb flex-1 lg:pb-0">{children}</main>
      <Footer settings={settings} />
      <MobileBottomNav />
    </>
  );
}
