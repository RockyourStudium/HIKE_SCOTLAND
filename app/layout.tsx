import type { Metadata } from "next";
import Script from "next/script";
import { Josefin_Sans, Lato } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import HideOnAdmin from "@/components/HideOnAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBand from "@/components/NewsletterBand";
import { TripProvider } from "@/lib/trip";
import { CatalogProvider } from "@/lib/catalog-client";
import { AuthProvider } from "@/lib/auth/AuthProvider";

// next/font downloads these at build time and self-hosts the .woff2 files,
// so the browser never makes a request to Google — no user data leaves the site.
const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // 700 for headings; 400/600 for lighter display use
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // 400 body text; 700 for bold UI elements
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hike Scotland — Hiking Routes, Guided Tours & Trip Planner",
    // Unterseiten liefern nur den reinen Seitentitel; das Template hängt
    // die Marke an (einheitliche, SEO-freundliche Titles).
    template: "%s — Hike Scotland",
  },
  description:
    "Explore hiking routes, guided tours and accommodation across Scotland. Build a personalised itinerary with our interactive trip planner.",
  keywords: [
    "Scotland hiking",
    "Munros",
    "West Highland Way",
    "guided tours",
    "hiking routes",
    "trip planner",
  ],
  openGraph: {
    type: "website",
    siteName: "Hike Scotland",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col bg-fog text-forest-dark">
        {/* Shared SVG gradient for Lucide icons — mirrors the site's
            forest-gradient (#081C15 → #2D6A4F). Reference via
            color="url(#hike-gradient)" on any icon over a light surface. */}
        <svg
          width="0"
          height="0"
          aria-hidden
          focusable="false"
          className="absolute"
        >
          <defs>
            <linearGradient id="hike-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#081C15" />
              <stop offset="100%" stopColor="#2D6A4F" />
            </linearGradient>
          </defs>
        </svg>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <CatalogProvider>
            <TripProvider>
              <HideOnAdmin>
                <Navbar />
              </HideOnAdmin>
              <main id="main" className="flex-1">
                {children}
              </main>
              <HideOnAdmin>
                <NewsletterBand />
                <Footer />
              </HideOnAdmin>
            </TripProvider>
          </CatalogProvider>
        </AuthProvider>
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="1582056d-c7ae-4fd4-bc8f-334b343bb61b"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
