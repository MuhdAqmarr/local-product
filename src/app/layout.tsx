import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://local-product.vercel.app"),
  title: { default: "LokalLah! — Semua jenama lokal, sentiasa up to date", template: "%s · LokalLah!" },
  description:
    "Direktori jenama Malaysia dari Cili Padi ke Jenama Ikon, dengan promo live dan launch baru terus dari kedai rasmi mereka.",
};

export const viewport: Viewport = {
  themeColor: "#FFF8F1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
