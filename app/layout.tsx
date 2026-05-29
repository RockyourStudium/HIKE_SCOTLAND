import type { Metadata } from "next";
import { Josefin_Sans, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
