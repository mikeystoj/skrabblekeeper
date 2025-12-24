import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { GameProvider } from "@/context/GameContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
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
  authors: [{ name: "Mayke" }],
  creator: "Mayke",
  openGraph: {
    title: "Skrabble Keeper - Simple Scrabble Score Tracker",
    description: "Free online Scrabble scorer with interactive board view. Track scores for up to 4 players.",
    type: "website",
    locale: "en_US",
    siteName: "Skrabble Keeper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skrabble Keeper - Simple Scrabble Score Tracker",
    description: "Free online Scrabble scorer with interactive board view. Track scores for up to 4 players.",
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
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
