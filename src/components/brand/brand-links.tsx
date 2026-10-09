import { Camera, Globe, Music2, ShoppingBag } from "@/components/ui/lucide";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { dictionaryFor } from "@/i18n/server";
import { outboundUrl } from "@/lib/format";
import type { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";

export type BrandLinkFields = Pick<Brand, "name" | "website" | "instagram" | "tiktok" | "shopee">;

function handleUrl(base: string, value: string, prefix = ""): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${base}${prefix}${value.replace(/^@/, "")}`;
}

export interface BrandLinksProps {
  brand: BrandLinkFields;
  /** Page language. */
  locale: Locale;
  /** Show the big ink "Visit official store ↗" button first (brand profile). */
  primary?: boolean;
  size?: "md" | "sm";
  className?: string;
}

/**
 * Website / Instagram / TikTok / Shopee (DESIGN §8.5 #3). Only links the brand actually has.
 * Social links have no lucide logos, so each pairs a generic icon with its text label.
 * Server only (reads the `brands` dictionary directly).
 */
export function BrandLinks({ brand, locale, primary = true, size = "sm", className }: BrandLinksProps) {
  const t = dictionaryFor(locale).brands.profile;
  const name = brand.name;
  const socials = [
    brand.instagram && { key: "ig", label: "Instagram", icon: <Camera aria-hidden size={18} />, href: handleUrl("https://www.instagram.com/", brand.instagram) },
    brand.tiktok && { key: "tt", label: "TikTok", icon: <Music2 aria-hidden size={18} />, href: handleUrl("https://www.tiktok.com/", brand.tiktok, "@") },
    brand.shopee && { key: "sp", label: "Shopee", icon: <ShoppingBag aria-hidden size={18} />, href: outboundUrl(handleUrl("https://shopee.com.my/", brand.shopee)) },
  ].filter(Boolean) as { key: string; label: string; icon: React.ReactNode; href: string }[];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {primary && brand.website && (
        <Button
          external
          href={outboundUrl(brand.website)}
          variant="outbound"
          size="md"
          trailing="outbound"
          className="w-full sm:w-auto sm:self-start"
          faceClassName="w-full"
          aria-label={fmt(t.visitLabel, { brand: name })}
        >
          {t.visit}
        </Button>
      )}
      {(socials.length > 0 || (!primary && brand.website)) && (
        <ul className="flex flex-wrap gap-2.5" aria-label={fmt(t.links, { brand: name })}>
          {!primary && brand.website && (
            <li>
              <Button external href={outboundUrl(brand.website)} variant="secondary" size={size} icon={<Globe aria-hidden size={18} />} aria-label={fmt(t.websiteLabel, { brand: name })}>
                {t.website}
              </Button>
            </li>
          )}
          {socials.map((l) => (
            <li key={l.key}>
              <Button external href={l.href} variant="secondary" size={size} icon={l.icon} aria-label={fmt(t.socialLabel, { brand: name, network: l.label })}>
                {l.label}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
