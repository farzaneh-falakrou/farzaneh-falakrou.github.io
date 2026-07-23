import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/base.css";
import { BrandMark } from "@/components/chrome/BrandMark";
import { FloatingDock } from "@/components/chrome/FloatingDock";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Farzaneh Falakrou",
  description: "Product designer portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body>
        <BrandMark />
        {children}
        <FloatingDock />
      </body>
    </html>
  );
}
