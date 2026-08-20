import { Fraunces, Inter } from "next/font/google";

// Condivisi tra i due layout radice (sito pubblico e dashboard):
// dichiararli una volta sola evita che next/font generi due set di
// file per gli stessi caratteri.
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${inter.variable}`;
