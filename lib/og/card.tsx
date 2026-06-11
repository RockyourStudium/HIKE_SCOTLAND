import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

interface OgCardProps {
  /** Kleine Zeile über dem Titel, z. B. "Guided hiking tour". */
  eyebrow: string;
  title: string;
  /** Kurze Fakten als Chips unter dem Titel (max. ~4, sonst wird's eng). */
  facts?: string[];
  /** Hintergrundfoto: Pfad unter /public, z. B. "/heroes/landing.jpg". */
  image: string;
}

/**
 * Gemeinsame OG-Card-Vorlage (1200×630) für alle opengraph-image.tsx-Routen:
 * Foto-Hintergrund + Forest-Verlauf, Brand-Zeile oben, Eyebrow/Titel/Fakten
 * unten — gerendert mit den Marken-Fonts (Josefin Sans / Lato, lokal in
 * lib/og/fonts, da Satori eigene Font-Daten braucht).
 *
 * Das Foto wird bewusst per absoluter URL von der Live-Site geladen (statt
 * fs): public/ liegt auf Vercel nicht im Function-Bundle, die CDN-URL
 * funktioniert dagegen in Build UND Runtime (ISR-Nachzügler).
 */
export async function ogCard({ eyebrow, title, facts = [], image }: OgCardProps) {
  const [josefin, lato, latoBold] = await Promise.all([
    readFile(join(process.cwd(), "lib/og/fonts/josefin-sans-latin-700.woff")),
    readFile(join(process.cwd(), "lib/og/fonts/lato-latin-400.woff")),
    readFile(join(process.cwd(), "lib/og/fonts/lato-latin-700.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#081C15",
          fontFamily: "Lato",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori-Kontext, kein DOM */}
        <img
          src={`${siteUrl}${image}`}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(8,28,21,0.30) 0%, rgba(8,28,21,0.45) 50%, rgba(8,28,21,0.93) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
          }}
        >
          {/* Brand-Zeile (spiegelt die Navbar) */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#95D5B2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3" />
            </svg>
            <span
              style={{
                fontFamily: "Josefin Sans",
                fontSize: "34px",
                color: "#D8F3DC",
              }}
            >
              Hike Scotland
            </span>
          </div>

          {/* Eyebrow + Titel + Fakten-Chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span
              style={{
                fontFamily: "Lato",
                fontWeight: 700,
                fontSize: "24px",
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: "#95D5B2",
              }}
            >
              {eyebrow}
            </span>
            <span
              style={{
                fontFamily: "Josefin Sans",
                fontSize: title.length > 34 ? "56px" : "72px",
                lineHeight: 1.08,
                color: "#FFFFFF",
              }}
            >
              {title}
            </span>
            {facts.length > 0 && (
              <div style={{ display: "flex", gap: "14px", marginTop: "6px" }}>
                {facts.map((fact) => (
                  <span
                    key={fact}
                    style={{
                      display: "flex",
                      padding: "10px 22px",
                      borderRadius: "999px",
                      border: "1.5px solid rgba(216,243,220,0.45)",
                      backgroundColor: "rgba(8,28,21,0.45)",
                      color: "#D8F3DC",
                      fontSize: "24px",
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Josefin Sans", data: josefin, weight: 700, style: "normal" },
        { name: "Lato", data: lato, weight: 400, style: "normal" },
        { name: "Lato", data: latoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
