import { ImageResponse } from "next/og";
import { OG_ALT, OG_SIZE } from "@/lib/site";

/**
 * Social card (1200 × 630) for Home: the Kedai Oyen look in a self-contained ImageResponse
 * (no fetches, no data, bundled font). Shared by opengraph-image.tsx and twitter-image.tsx.
 * Raw hex is fine here: this renders to a PNG, not to the page (values mirror the palette tokens).
 */
export { OG_ALT, OG_SIZE };

const INK = "#2B1736";
const PETAL = "M50 50C34 46 22 30 30 17C35 9 45 10 50 18C55 10 65 9 70 17C78 30 66 46 50 50Z";
const BOLD = { WebkitTextStroke: `2px ${INK}` } as const;

function Flower({ size, petal = "#FF6FB5", centre = "#FFD54F" }: { size: number; petal?: string; centre?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL} transform={`rotate(${a} 50 50)`} fill={petal} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ))}
      <circle cx="50" cy="50" r="11" fill={centre} stroke={INK} strokeWidth={4} />
    </svg>
  );
}

function OyenHead({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <g stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M42 60L35.5 24Q34 15 42 19L72 38Z" fill="#FFAA55" />
        <path d="M118 60L124.5 24Q126 15 118 19L88 38Z" fill="#FFAA55" />
        <path d="M45 50L41.5 29.5L61 41Z" fill="#FF6FB5" stroke="none" />
        <path d="M115 50L118.5 29.5L99 41Z" fill="#FF6FB5" stroke="none" />
        <path d="M28 78C28 48 52 33 80 33C108 33 132 48 132 78C132 108 110 123 80 123C50 123 28 108 28 78Z" fill="#FFAA55" />
        <path d="M70 39L72 50M80 36V49M90 39L88 50M30 72H40M130 72H120M31 82H38M129 82H122" stroke="#E07020" strokeWidth={4.5} fill="none" />
        <path d="M80 89C74 85 62 86 62 97C62 106 72 109 80 105C88 109 98 106 98 97C98 86 86 85 80 89Z" fill="#FFF3E6" stroke="none" />
        <ellipse cx="48" cy="93" rx="8.5" ry="5" fill="#FF6FB5" stroke="none" opacity={0.75} />
        <ellipse cx="112" cy="93" rx="8.5" ry="5" fill="#FF6FB5" stroke="none" opacity={0.75} />
        <path d="M54 80Q61 71 68 80M92 80Q99 71 106 80" fill="none" />
        <path d="M76 88H84L80 93Z" fill="#FF6FB5" strokeWidth={2} />
        <path d="M72 95Q76 100 80 95Q84 100 88 95" fill="none" strokeWidth={2.5} />
        <path d="M22 88L38 90M24 98L38 96M138 88L122 90M136 98L122 96" strokeWidth={2} fill="none" />
        <path d="M60 124C60 116 72 114 74 122M86 122C88 114 100 116 100 124" fill="#FFAA55" strokeWidth={3} />
      </g>
    </svg>
  );
}

export function ogImage() {
  const stripes = Array.from({ length: 30 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFF8F1",
          color: INK,
        }}
      >
        {/* awning */}
        <div style={{ display: "flex", height: 44, borderBottom: `4px solid ${INK}` }}>
          {stripes.map((i) => (
            <div key={i} style={{ flex: 1, height: 44, background: i % 2 ? "#FFFFFF" : "#FF6FB5", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            margin: "36px 44px 44px",
            padding: "44px 56px",
            borderRadius: 40,
            border: `4px solid ${INK}`,
            boxShadow: `10px 10px 0 ${INK}`,
            background: "linear-gradient(160deg, #FFE3F1 0%, #F1E6FF 48%, #DDF3FF 100%)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Flower size={56} />
              <div style={{ display: "flex", fontSize: 46, ...BOLD }}>
                <span>Lokal</span>
                <span style={{ color: "#C0136A", WebkitTextStroke: "2px #C0136A", marginLeft: -8 }}>Lah!</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontSize: 76, lineHeight: 1.06, letterSpacing: -2, ...BOLD }}>
              <div style={{ display: "flex" }}>
                <span>Semua jenama&nbsp;</span>
                <span style={{ color: "#D61F66", WebkitTextStroke: "2px #D61F66" }}>lokal</span>
                <span>,</span>
              </div>
              <div style={{ display: "flex" }}>
                <span>sentiasa&nbsp;</span>
                <span style={{ display: "flex", background: "linear-gradient(transparent 58%, #FFD54F 58%, #FFD54F 94%, transparent 94%)" }}>up to date</span>
                <span>.</span>
              </div>
            </div>

            <div style={{ display: "flex", marginTop: 30, fontSize: 28, lineHeight: 1.4, color: "#4A3B5C", maxWidth: 640 }}>
              Promo live dan launch baru, terus dari kedai rasmi jenama Malaysia. Dari Cili Padi sampai Jenama Ikon.
            </div>
          </div>

          <div style={{ display: "flex", position: "absolute", right: 48, bottom: 36 }}>
            <OyenHead size={250} />
          </div>
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: 70,
              top: 40,
              width: 150,
              height: 150,
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-10deg)",
              borderRadius: 999,
              background: "#FFD54F",
              border: `4px solid ${INK}`,
              fontSize: 34,
              ...BOLD,
            }}
          >
            LIVE!
          </div>
          <div style={{ display: "flex", position: "absolute", right: 250, top: 150 }}>
            <Flower size={64} petal="#FF8FC8" centre="#C0136A" />
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
