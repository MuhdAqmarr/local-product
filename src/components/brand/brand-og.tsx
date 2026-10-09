import { ImageResponse } from "next/og";
import { getBrandSummaries } from "@/lib/catalog";
import { getBrand } from "@/lib/brands";
import { monogram } from "@/lib/monogram";
import { OG_SIZE } from "@/lib/site";
import { CATEGORY_BY_SLUG, TIER_BY_SLUG } from "@/lib/taxonomy";
import type { CategorySlug, TierSlug } from "@/lib/types";

/**
 * Per-brand social card (1200 × 630, QA F10): candy gradient in the category colours, the brand's
 * monogram shape, name, tier cop, category and live counts, plus the LokalLah! mark. Shared by
 * app/brands/[slug]/opengraph-image.tsx and twitter-image.tsx. Raw hex mirrors the palette tokens
 * (this renders to a PNG, not to the page).
 */
export const BRAND_OG_SIZE = OG_SIZE;
export const BRAND_OG_ALT = "Kad jenama LokalLah!: monogram, saiz jenama, kategori dan kiraan promo live dari kedai rasmi.";

const INK = "#2B1736";
const BOLD = { WebkitTextStroke: `2px ${INK}` } as const;
const PETAL = "M50 50C34 46 22 30 30 17C35 9 45 10 50 18C55 10 65 9 70 17C78 30 66 46 50 50Z";

const CAT: Record<CategorySlug, { tint: string; mid: string; pop: string; ink: string }> = {
  beauty: { tint: "#FFE8EE", mid: "#FFB3C4", pop: "#FF8FA8", ink: "#AD1D45" },
  fashion: { tint: "#ECEAFF", mid: "#BDB6FF", pop: "#9D93FF", ink: "#4B3DC4" },
  accessories: { tint: "#F4E9FF", mid: "#D9BAF7", pop: "#C79BF2", ink: "#7333A6" },
  food: { tint: "#FFEBE2", mid: "#FFB99F", pop: "#FF9772", ink: "#AE3A10" },
  drinks: { tint: "#F8EEE3", mid: "#E5C0A1", pop: "#D8A275", ink: "#83461A" },
  home: { tint: "#E1F6EA", mid: "#A3E3BF", pop: "#79D6A3", ink: "#17704A" },
  health: { tint: "#DEF5F2", mid: "#96DED7", pop: "#66CFC5", ink: "#0C6964" },
  kids: { tint: "#FFF4D3", mid: "#FFDF8A", pop: "#FFD159", ink: "#7F5900" },
  tech: { tint: "#E2F0FF", mid: "#A4CFFF", pop: "#7BB9FF", ink: "#0E5AA4" },
  crafts: { tint: "#FBE7F7", mid: "#EEAFE3", pop: "#E58AD5", ink: "#922781" },
  lifestyle: { tint: "#EDF7DA", mid: "#C2E395", pop: "#A6D667", ink: "#4A6611" },
};

const TIER: Record<TierSlug, { tint: string; ink: string }> = {
  "cili-padi": { tint: "#FFE5DF", ink: "#B0271B" },
  "naik-daun": { tint: "#DFF5E4", ink: "#1B6D36" },
  ikon: { tint: "#FFF0C4", ink: "#7A5300" },
};

export async function brandOgImage(slug: string) {
  const brand = getBrand(slug);
  const summary = brand ? (await getBrandSummaries()).find((b) => b.slug === slug) : undefined;
  const name = brand?.name ?? "LokalLah!";
  const category: CategorySlug = brand?.category ?? "beauty";
  const tier: TierSlug = brand?.tier ?? "naik-daun";
  const c = CAT[category];
  const t = TIER[tier];
  const mono = monogram(slug, name);
  const parts = summary ? [summary.promoCount && `${summary.promoCount} promo`, summary.newCount && `${summary.newCount} baru`].filter(Boolean) : [];
  const counts = parts.length
    ? parts.join(" · ")
    : summary?.live
      ? "Kedai rasmi disemak live"
      : summary?.hasFeed
      ? "Rak online kosong buat masa ni"
      : "Direktori jenama lokal";
  const nameSize = name.length <= 12 ? 96 : name.length <= 20 ? 76 : name.length <= 28 ? 60 : 48;
  const stripes = Array.from({ length: 30 }, (_, i) => i);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFF8F1", color: INK }}>
        {/* awning in the category colour */}
        <div style={{ display: "flex", height: 44, borderBottom: `4px solid ${INK}` }}>
          {stripes.map((i) => (
            <div key={i} style={{ flex: 1, height: 44, background: i % 2 ? "#FFFFFF" : c.pop, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            gap: 56,
            margin: "36px 44px 44px",
            padding: "40px 56px",
            borderRadius: 40,
            border: `4px solid ${INK}`,
            boxShadow: `10px 10px 0 ${INK}`,
            background: `linear-gradient(150deg, ${c.tint} 0%, #FFFFFF 55%, ${t.tint} 100%)`,
            position: "relative",
          }}
        >
          {/* monogram: the brand's own candy shape + tilt */}
          <div style={{ display: "flex", position: "relative", width: 300, height: 300, flexShrink: 0, transform: `rotate(${mono.rotate}deg)` }}>
            <svg width={300} height={300} viewBox="-4 -4 108 108" style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={mono.shape} fill={c.mid} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
              <ellipse cx="32" cy="27" rx="9" ry="5" transform="rotate(-30 32 27)" fill="#FFFFFF" opacity={0.6} />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 300,
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Array.from(mono.initials).length > 1 ? 104 : 132,
                letterSpacing: -2,
                ...BOLD,
              }}
            >
              {mono.initials}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  borderRadius: 14,
                  background: t.tint,
                  color: t.ink,
                  border: `3px dashed ${t.ink}`,
                  fontSize: 30,
                  WebkitTextStroke: `1px ${t.ink}`,
                }}
              >
                {TIER_BY_SLUG[tier].name}
              </div>
              <div style={{ display: "flex", fontSize: 30, color: c.ink }}>{CATEGORY_BY_SLUG[category].nameMs}</div>
            </div>
            <div style={{ display: "flex", marginTop: 22, fontSize: nameSize, lineHeight: 1.05, letterSpacing: -2, ...BOLD }}>{name}</div>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                marginTop: 28,
                padding: "10px 24px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: `3px solid ${INK}`,
                fontSize: 32,
              }}
            >
              {counts}
            </div>
          </div>

          {/* LokalLah! mark */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, position: "absolute", right: 40, bottom: 28 }}>
            <svg width={44} height={44} viewBox="0 0 100 100">
              {[0, 72, 144, 216, 288].map((a) => (
                <path key={a} d={PETAL} transform={`rotate(${a} 50 50)`} fill="#FF6FB5" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
              ))}
              <circle cx="50" cy="50" r="11" fill="#FFD54F" stroke={INK} strokeWidth={4} />
            </svg>
            <div style={{ display: "flex", fontSize: 36, ...BOLD }}>
              <span>Lokal</span>
              <span style={{ color: "#C0136A", WebkitTextStroke: "2px #C0136A", marginLeft: -6 }}>Lah!</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...BRAND_OG_SIZE },
  );
}
