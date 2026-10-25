import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GameProvider } from "@/context/GameContext";
import { ProProvider } from "@/context/ProContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Skrabble Keeper - Free Scrabble Score Keeper & Calculator",
    template: "%s | Skrabble Keeper",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "scrabble score keeper",
    "scrabble scorer",
    "scrabble score calculator",
    "scrabble score tracker",
    "scrabble score sheet",
    "scrabble scoreboard",
    "scrabble points calculator",
    "scrabble letter values",
    "scrabble board",
    "word game scorer",
    "free scrabble scorer",
    "online scrabble keeper"
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "games",
  openGraph: {
    title: "Skrabble Keeper - Free Scrabble Score Keeper & Calculator",
    description: "Tap words onto an interactive Scrabble board and get the score instantly. Free for up to 4 players.",
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    site: "@skrabblekeeper",
    creator: "@skrabblekeeper",
    title: "Skrabble Keeper - Free Scrabble Score Keeper & Calculator",
    description: "Tap words onto an interactive Scrabble board and get the score instantly. Free for up to 4 players.",
  },
  appleWebApp: {
    capable: true,
    title: "Skrabble",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          <ProProvider>
            <GameProvider>
              {children}
            </GameProvider>
          </ProProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
