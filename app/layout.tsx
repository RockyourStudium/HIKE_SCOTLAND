import type { Metadata } from "next";
import { Josefin_Sans, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterBand from "@/components/NewsletterBand";
import { TripProvider } from "@/lib/trip";

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
  title: "Hike Scotland — Discover & Plan Scottish Hiking Adventures",
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
        <TripProvider>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <NewsletterBand />
          <Footer />
        </TripProvider>
      </body>
    </html>
  );
}
