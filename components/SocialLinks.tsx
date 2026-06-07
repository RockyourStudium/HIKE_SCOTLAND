import { Globe } from "lucide-react";
import { SOCIAL_PLATFORMS, socialUrl, type SocialKey, type Socials } from "@/lib/profile";

// lucide-react führt aus Markenschutz-Gründen keine Social-Brand-Icons mehr —
// daher kleine Inline-SVGs im gleichen 24×24-Raster.
type IconProps = { className?: string };

function Instagram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function Youtube({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .7 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.3 12 31 31 0 0 0 23 7.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
    </svg>
  );
}

function Tiktok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M16.5 3c.3 2.1 1.5 3.4 3.5 3.6v2.4c-1.2.1-2.3-.2-3.5-.9v5.6c0 3.4-2.6 5.8-5.8 5.3-2.6-.4-4.2-2.6-4-5.1.2-2.4 2.3-4.2 4.7-4.1.3 0 .6 0 .9.1v2.5c-.3-.1-.6-.2-.9-.2-1.2 0-2.1 1-2 2.2.1 1.1 1 1.9 2.1 1.8 1.1-.1 1.9-1 1.9-2.2V3h3.1z" />
    </svg>
  );
}

function Linkedin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const ICONS: Record<SocialKey, (p: IconProps) => JSX.Element> = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Tiktok,
  linkedin: Linkedin,
};

/**
 * Social- und Website-Links für die öffentliche Profilseite (dunkler Stil).
 * Rendert nur, was wirklich gesetzt ist.
 */
export default function SocialLinks({
  socials,
  website,
}: {
  socials: Socials;
  website?: string | null;
}) {
  const entries = SOCIAL_PLATFORMS.filter((p) => socials[p.key]).map((p) => ({
    key: p.key,
    label: p.label,
    href: socialUrl(p.key, socials[p.key]!),
    Icon: ICONS[p.key],
  }));

  if (entries.length === 0 && !website) return null;

  const pill =
    "inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-sm font-medium text-fog ring-1 ring-white/10 transition-colors hover:bg-white/[0.14]";

  return (
    <div className="flex flex-wrap gap-3">
      {website && (
        <a href={website} target="_blank" rel="me noopener noreferrer" className={pill}>
          <Globe aria-hidden className="h-4 w-4 text-mint" strokeWidth={2} />
          Website
        </a>
      )}
      {entries.map(({ key, label, href, Icon }) => (
        <a key={key} href={href} target="_blank" rel="me noopener noreferrer" className={pill}>
          <Icon className="h-4 w-4 text-mint" />
          {label}
        </a>
      ))}
    </div>
  );
}
