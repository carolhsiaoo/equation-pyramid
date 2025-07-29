import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import LayoutContent from "./layout-content";
import { NEXT_PUBLIC_GOOGLE_ANALYTICS_ID } from "@/constants";

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equation Pyramid - Math Puzzle Game",
  description:
    "Challenge your math skills with Equation Pyramid! Form equations using number tiles to reach target values in this addictive puzzle game inspired by The Devil's Plan.",
  keywords: [
    "math game",
    "puzzle game",
    "equation game",
    "brain training",
    "mental math",
    "educational game",
  ],
  authors: [{ name: "Carol & Eason" }],
  creator: "Carol & Eason",
  publisher: "Equation Pyramid",
  manifest: "/manifest.json",
  openGraph: {
    title: "Equation Pyramid - Math Puzzle Game",
    description:
      "Challenge your math skills with Equation Pyramid! Form equations using number tiles to reach target values.",
    type: "website",
    locale: "en_US",
    siteName: "Equation Pyramid",
    images: [
      {
        url: "/og.jpg",
        width: 1289,
        height: 712,
        alt: "Equation Pyramid - Math Puzzle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equation Pyramid - Math Puzzle Game",
    description:
      "Challenge your math skills with Equation Pyramid! Form equations using number tiles to reach target values.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutContent>{children}</LayoutContent>
        {NEXT_PUBLIC_GOOGLE_ANALYTICS_ID &&
          process.env.NODE_ENV === "production" && (
            <GoogleAnalytics gaId={NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
          )}
      </body>
    </html>
  );
}
