import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { BRAND } from "@/lib/constants/brand";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${BRAND.name} | Ethiopian Yirgacheffe Green Coffee Exporter`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    `${BRAND.legalName} — processor and exporter of high quality, traceable Ethiopian Yirgacheffe green coffee from the Gedeo highlands.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
