// Geteilte Helfer für öffentliche User-Profile: Username-Regeln, Social-Links und
// Normalisierung. Bewusst framework-frei (kein "use client"/"server-only"), damit
// sowohl Server Actions als auch die (Server-)Profilseite es importieren können.

export type SocialKey = "instagram" | "youtube" | "tiktok" | "linkedin";

export type Socials = Partial<Record<SocialKey, string>>;

/** Reihenfolge + Anzeige-Metadaten der unterstützten Plattformen. */
export const SOCIAL_PLATFORMS: {
  key: SocialKey;
  label: string;
  /** Vorangestellt vor dem gespeicherten Handle, um die Profil-URL zu bauen. */
  baseUrl: string;
  /** Platzhalter/Hinweis fürs Eingabefeld. */
  placeholder: string;
}[] = [
  { key: "instagram", label: "Instagram", baseUrl: "https://instagram.com/", placeholder: "username" },
  { key: "youtube", label: "YouTube", baseUrl: "https://youtube.com/@", placeholder: "handle" },
  { key: "tiktok", label: "TikTok", baseUrl: "https://tiktok.com/@", placeholder: "username" },
  { key: "linkedin", label: "LinkedIn", baseUrl: "https://linkedin.com/in/", placeholder: "vanity-name" },
];

/** 3–30 Zeichen: Kleinbuchstaben, Ziffern, _-. Spiegelt den DB-Check-Constraint. */
export const USERNAME_RE = /^[a-z0-9_-]{3,30}$/;

/** Reserviert, weil es mit bestehenden Top-Level-Routen kollidieren würde. */
export const RESERVED_USERNAMES = new Set([
  "account", "admin", "api", "auth", "profiles", "profile", "tours", "routes",
  "stays", "plan", "my-trip", "destinations", "credits", "newsletter",
  "unsubscribe", "login", "logout", "signin", "signout", "settings", "u",
  "about", "help", "support", "terms", "privacy", "_next", "static",
]);

/** lowercase + trim. Leere Eingabe -> null. */
export function normalizeUsername(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  return v.length ? v : null;
}

/** null | "ok" | "format" | "reserved" — Eindeutigkeit prüft die DB separat. */
export function validateUsername(username: string | null): "ok" | "format" | "reserved" {
  if (!username) return "ok"; // leeres Username-Feld ist erlaubt (nur dann nicht öffentlich)
  if (!USERNAME_RE.test(username)) return "format";
  if (RESERVED_USERNAMES.has(username)) return "reserved";
  return "ok";
}

/** Entfernt führendes @ und URL-Teile; gibt das nackte Handle zurück (oder null). */
export function normalizeHandle(raw: string): string | null {
  let v = raw.trim();
  if (!v) return null;
  // Falls jemand eine volle URL einfügt: nur den letzten Pfadteil behalten.
  v = v.replace(/^https?:\/\/[^/]+\//i, "").replace(/\/+$/, "");
  v = v.replace(/^@+/, "");
  return v.length ? v.slice(0, 80) : null;
}

/** Ergänzt fehlendes Schema; gibt eine valide http(s)-URL zurück (oder null). */
export function normalizeWebsite(raw: string): string | null {
  let v = raw.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const url = new URL(v);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Baut die vollständige Profil-URL einer Plattform aus dem Handle. */
export function socialUrl(key: SocialKey, handle: string): string {
  const platform = SOCIAL_PLATFORMS.find((p) => p.key === key);
  return platform ? `${platform.baseUrl}${handle}` : handle;
}
