import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GameProvider } from "@/context/GameContext";
import { ProProvider } from "@/context/ProContext";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://skrabblekeeper.com'),
  title: "Skrabble Keeper - Simple Scrabble Score Tracker with Board View",
  description: "Free online Scrabble scorer and score keeper with interactive board view. Track scores, words, and game history for up to 4 players. Simple, fast, and works offline.",
  keywords: [
    "scrabble scorer",
    "scrabble score keeper", 
    "scrabble tracker",
    "scrabble board",
    "word game scorer",
    "scrabble calculator",
    "scrabble score tracker",
    "free scrabble scorer",
    "online scrabble keeper"
  ],
  authors: [{ name: "Skrabble Keeper" }],
  creator: "Skrabble Keeper",
  openGraph: {
    title: "Skrabble Keeper - Simple Scrabble Score Tracker",
    description: "Free online Scrabble scorer with interactive board view. Track scores for up to 4 players.",
    type: "website",
    locale: "en_US",
    siteName: "Skrabble Keeper",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Skrabble Keeper - Simple Scrabble Score Tracker with Board View",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skrabble Keeper - Simple Scrabble Score Tracker",
    description: "Free online Scrabble scorer with interactive board view. Track scores for up to 4 players.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/Skrabble_Favicon.png",
    apple: "/Skrabble_Favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skrabble" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1e3a5f" />
      </head>
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
