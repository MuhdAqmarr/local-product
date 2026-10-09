import { Camera, Globe, Music2, ShoppingBag } from "@/components/ui/lucide";
import { Button } from "@/components/ui/button";
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
  /** Show the big ink "Lawat kedai rasmi ↗" button first (brand profile). */
  primary?: boolean;
  size?: "md" | "sm";
  className?: string;
}

/**
 * Website / Instagram / TikTok / Shopee (DESIGN §8.5 #3). Only links the brand actually has.
 * Social links have no lucide logos, so each pairs a generic icon with its text label.
 */
export function BrandLinks({ brand, primary = true, size = "sm", className }: BrandLinksProps) {
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
          aria-label={`Lawat kedai rasmi ${brand.name} (tab baru)`}
        >
          Lawat kedai rasmi
        </Button>
      )}
      {(socials.length > 0 || (!primary && brand.website)) && (
        <ul className="flex flex-wrap gap-2.5" aria-label={`Pautan ${brand.name}`}>
          {!primary && brand.website && (
            <li>
              <Button external href={outboundUrl(brand.website)} variant="secondary" size={size} icon={<Globe aria-hidden size={18} />} aria-label={`Laman web ${brand.name} (tab baru)`}>
                Laman web
              </Button>
            </li>
          )}
          {socials.map((l) => (
            <li key={l.key}>
              <Button external href={l.href} variant="secondary" size={size} icon={l.icon} aria-label={`${l.label} ${brand.name} (tab baru)`}>
                {l.label}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
