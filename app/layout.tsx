import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="en">
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
