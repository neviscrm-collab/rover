import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import BottomDock from "@/components/layout/bottom-dock";
import SideRail from "@/components/layout/side-rail";
import AIOrb from "@/components/shared/ai-orb";
import BookingSheet from "@/components/booking/booking-sheet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROVER — Experience-first travel for Gen Z",
  description:
    "Discover and join curated adventures with people who get it. From Himalayas to Tokyo — ROVER takes you there.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ROVER",
  },
  openGraph: {
    title: "ROVER",
    description: "Experience-first travel for Gen Z",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05050A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <Providers>
          {/* Desktop side navigation */}
          <SideRail />

          {/* Main content */}
          <main>{children}</main>

          {/* Mobile bottom dock */}
          <BottomDock />

          {/* Floating AI assistant */}
          <AIOrb />

          {/* Global booking sheet */}
          <BookingSheet />
        </Providers>
      </body>
    </html>
  );
}
