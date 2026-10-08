import { ImageResponse } from "next/og";

/** App icons from the logo mark (Appendix D #1): bandung bunga raya, ink outline, mangga centre, on a santan tile. */
const PETAL = "M50 50C34 46 22 30 30 17C35 9 45 10 50 18C55 10 65 9 70 17C78 30 66 46 50 50Z";
const ANGLES = [0, 72, 144, 216, 288];
const SIZES = [32, 192, 512] as const;

export function generateImageMetadata() {
  return SIZES.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType: "image/png", alt: "LokalLah!" }));
}

function Mark({ size, stroke }: { size: number; stroke: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FF6FB5" stroke="#2B1736" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
        {ANGLES.map((a) => (
          <path key={a} d={PETAL} transform={`rotate(${a} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="12" fill="#FFD54F" stroke="#2B1736" strokeWidth={stroke} />
    </svg>
  );
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id) || 32;
  const small = size <= 48;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF8F1",
          borderRadius: small ? size * 0.22 : 0,
        }}
      >
        <Mark size={Math.round(size * (small ? 0.94 : 0.72))} stroke={small ? 6.5 : 4.5} />
      </div>
    ),
    { width: size, height: size },
  );
}
