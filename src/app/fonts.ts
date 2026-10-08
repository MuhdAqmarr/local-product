// src/app/fonts.ts — exact next/font/google configuration
import { Fredoka, Gochi_Hand, Poppins } from "next/font/google";

/** MAIN font: everything readable (UI, body, headings). 3 static weights, ~23.7 KB, preloaded. */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal"],
  display: "swap",
  variable: "--font-poppins",
});

/** MINOR 1, the "candy numerals" voice: prices, discounts, counters, sticker labels, monogram initials, wordmark. ~16.5 KB, preloaded. */
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-fredoka",
});

/** MINOR 2, the tauke's marker pen: max 1 annotation per viewport, never essential info. ~19.6 KB, NOT preloaded. */
export const gochi = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "optional",
  preload: false,
  variable: "--font-gochi",
});

export const fontVariables = `${poppins.variable} ${fredoka.variable} ${gochi.variable}`;
