import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
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
import { getStats } from "@/lib/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Direktori jenama Malaysia dari Cili Padi ke Jenama Ikon, dengan promo live dan launch baru terus dari kedai rasmi mereka.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "LokalLah! — Semua jenama lokal, sentiasa up to date", template: "%s · LokalLah!" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ms_MY",
    title: "LokalLah! — Semua jenama lokal, sentiasa up to date",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FFF8F1",
  colorScheme: "only light",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const stats = await getStats();
  return (
    <html lang="ms-MY" className={fontVariables} suppressHydrationWarning>
      <head>
        <MotionPrefScript />
        <InitialRevealScript />
      </head>
      <body className="font-sans text-ink antialiased">
        <SkipLink />
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
      </body>
    </html>
  );
}
