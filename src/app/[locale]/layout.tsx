import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cinzel, Cinzel_Decorative, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "../globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

// Localized site-wide defaults; pages override title/description/OG via
// buildPageMeta (Next.js does not inherit page titles into og:* tags).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image" },
  };
}

// Organization JSON-LD — rich results for the label (logo, links, contact).
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-mark.svg`,
  email: "magicstoriesrecords@gmail.com",
  sameAs: [
    "https://www.beatport.com/label/magic-stories-records/104305",
    "https://soundcloud.com/magicstoriesrec",
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enables static rendering for pages that don't read request data.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${cinzel.variable} ${cinzelDecorative.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider>
          <Nav />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
