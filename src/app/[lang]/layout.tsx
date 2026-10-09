import type { Metadata, Viewport } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";
import { MotionPrefScript } from "@/components/providers/motion-pref-script";
import { InitialRevealScript } from "@/components/providers/initial-reveal-script";
import { Providers } from "@/components/providers/providers";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { SearchProvider } from "@/components/search/search-provider";
import { SkipLink } from "@/components/layout/skip-link";
import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout/footer";
import { TabBar } from "@/components/layout/tab-bar";
import { BackToTop } from "@/components/layout/back-to-top";
import { ToastRegion } from "@/components/feedback/toast-region";
import { I18nProvider } from "@/i18n/client";
import { htmlLang, languageAlternates, LOCALES, otherLocale, ogLocale } from "@/i18n/config";
import { dictionaryFor, getLocale, messagesFor } from "@/i18n/server";
import { getStats } from "@/lib/catalog";
import { MAKER, ogImages, SITE_NAME, SITE_URL, twitterImages } from "@/lib/site";

/** Both languages are prerendered; the proxy maps `/…` → `/en/…` and serves `/ms/…` as-is. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Site-wide defaults per language. Pages override title/description/alternates via pageMetadata(). */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictionaryFor(locale).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.siteTitle, template: `%s · ${SITE_NAME}` },
    description: t.description,
    applicationName: SITE_NAME,
    authors: [{ name: MAKER.name, url: MAKER.url }],
    creator: MAKER.name,
    publisher: MAKER.name,
    alternates: { canonical: locale === "ms" ? "/ms" : "/", languages: languageAlternates("/") },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      alternateLocale: [ogLocale(otherLocale(locale))],
      title: t.siteTitle,
      description: t.description,
      images: ogImages(locale),
    },
    twitter: { card: "summary_large_image", title: t.siteTitle, description: t.description, images: twitterImages(locale) },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFF8F1",
  colorScheme: "only light",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const stats = await getStats();
  return (
    <html lang={htmlLang(locale)} className={fontVariables} suppressHydrationWarning>
      <head>
        <MotionPrefScript />
        <InitialRevealScript />
      </head>
      <body className="font-sans text-ink antialiased">
        <SkipLink />
        <I18nProvider locale={locale} messages={messagesFor(locale, "common", "search", "saved")}>
          <Providers>
            <SearchProvider>
              <SiteHeader promoCount={stats.promos} />
              <main id="main" tabIndex={-1} className="min-h-[60dvh] outline-none">
                {children}
              </main>
              <Footer />
              <TabBar promoCount={stats.promos} />
              <BackToTop />
              <ToastRegion />
              <RevealObserver />
            </SearchProvider>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
