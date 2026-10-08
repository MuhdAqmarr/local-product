import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const PETAL = "M50 50C34 46 22 30 30 17C35 9 45 10 50 18C55 10 65 9 70 17C78 30 66 46 50 50Z";
const ANGLES = [0, 72, 144, 216, 288];

/** Home-screen icon: the logo mark on a soft gula-kapas tile (iOS rounds the corners itself). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFE4F1 0%, #FFF8F1 55%, #F3EFFF 100%)",
        }}
      >
        <svg width={128} height={128} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FF6FB5" stroke="#2B1736" strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round">
            {ANGLES.map((a) => (
              <path key={a} d={PETAL} transform={`rotate(${a} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="12" fill="#FFD54F" stroke="#2B1736" strokeWidth={4.5} />
        </svg>
      </div>
    ),
    size,
  );
}
