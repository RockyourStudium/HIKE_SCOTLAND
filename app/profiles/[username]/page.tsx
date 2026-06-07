import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import SocialLinks from "@/components/SocialLinks";
import { createClient } from "@/lib/supabase/server";
import { getTours, getRoutes, getStays } from "@/lib/catalog";
import { heroImage } from "@/lib/heroImage";
import { normalizeUsername, type Socials } from "@/lib/profile";

// Profile ändern sich selten; kurze ISR statt force-dynamic.
export const revalidate = 60;

type PublicProfile = {
  username: string;
  display_name: string | null;
  bio: string | null;
  websites: string[];
  location: string | null;
  avatar_url: string | null;
  socials: Socials;
  created_at: string | null;
};

async function getPublicProfile(username: string): Promise<PublicProfile | null> {
  const key = normalizeUsername(username);
  if (!key) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("username, display_name, bio, websites, location, avatar_url, socials, created_at")
    .eq("username", key)
    .maybeSingle();

  if (!data?.username) return null;
  return {
    username: data.username,
    display_name: data.display_name,
    bio: data.bio,
    websites: Array.isArray(data.websites) ? (data.websites as string[]) : [],
    location: data.location,
    avatar_url: data.avatar_url,
    socials: (data.socials ?? {}) as Socials,
    created_at: data.created_at,
  };
}

type Trip = { item_type: string; item_id: string; title: string };

const TRIP_META: Record<string, { base: string; label: string }> = {
  tour: { base: "/tours", label: "Tour" },
  route: { base: "/routes", label: "Route" },
  stay: { base: "/stays", label: "Stay" },
};

type TripCard = Trip & { image?: string; gradient: string; region?: string };

async function getTrips(username: string): Promise<Trip[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("public_profile_trips")
    .select("item_type, item_id, title")
    .eq("username", username);

  return (data ?? [])
    .filter((t): t is Trip => Boolean(t.item_type && t.item_id && t.title))
    .map((t) => ({ item_type: t.item_type!, item_id: t.item_id!, title: t.title! }));
}

/** Reichert die gebuchten Posten mit Highlight-Foto/Gradient + Region aus dem
 *  Katalog an (public-read). Bewahrt die Reihenfolge der Trips. */
async function withCatalog(trips: Trip[]): Promise<TripCard[]> {
  if (trips.length === 0) return [];
  const [tours, routes, stays] = await Promise.all([getTours(), getRoutes(), getStays()]);

  const map = new Map<string, { image?: string; gradient: string; region?: string }>();
  for (const t of tours) map.set(`tour:${t.id}`, { image: t.image, gradient: t.gradient, region: t.region });
  for (const r of routes) map.set(`route:${r.id}`, { image: r.image, gradient: r.gradient, region: r.region });
  for (const s of stays) map.set(`stay:${s.id}`, { gradient: s.gradient, region: s.region });

  return trips.map((t) => {
    const hit = map.get(`${t.item_type}:${t.item_id}`);
    return { ...t, image: hit?.image, gradient: hit?.gradient ?? "", region: hit?.region };
  });
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getPublicProfile(params.username);
  if (!profile) return { title: "Profile not found — Hike Scotland" };

  const name = profile.display_name || `@${profile.username}`;
  const description =
    profile.bio || `${name} on Hike Scotland — trails, tours and the highlands.`;

  return {
    title: `${name} — Hike Scotland`,
    description,
    openGraph: {
      title: `${name} — Hike Scotland`,
      description,
      type: "profile",
      ...(profile.avatar_url ? { images: [{ url: profile.avatar_url }] } : {}),
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getPublicProfile(params.username);
  if (!profile) notFound();

  const trips = await withCatalog(await getTrips(profile.username));
  const name = profile.display_name || `@${profile.username}`;
  const memberSince = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : null;

  return (
    <div className="bg-forest-darkest text-fog">
      {/* Dunkler Header mit Foto-Backdrop (Pattern aus CinematicHero) */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage("profile")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest via-forest-darkest/80 to-forest-darkest/50" />
        <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-forest-darkest/70 to-transparent" />

        <Container py="standard" size="5xl">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
            {/* Avatar (plain img wie im UserMenu — keine Remote-Domain-Config nötig) */}
            <span className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint text-3xl font-bold text-forest-darkest ring-4 ring-white/10 sm:h-32 sm:w-32">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                name.replace(/^@/, "").charAt(0).toUpperCase()
              )}
            </span>

            <div className="min-w-0">
              <Eyebrow tone="mint" dash>
                Hiker
              </Eyebrow>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-fog sm:text-5xl">
                {name}
              </h1>
              <p className="mt-1 text-lg text-fog/70">@{profile.username}</p>
              {profile.location && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-fog/70">
                  <MapPin aria-hidden className="h-4 w-4 text-mint" strokeWidth={2} />
                  {profile.location}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Bio + Links */}
      <Container py="compact" size="5xl">
        {profile.bio && (
          <p className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-fog/85">
            {profile.bio}
          </p>
        )}

        <div className="mt-8">
          <SocialLinks socials={profile.socials} websites={profile.websites} />
        </div>

        {trips.length > 0 && (
          <section className="mt-12">
            <Eyebrow tone="mint" dash>
              Adventures
            </Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-bold text-fog">
              Booked trips
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {trips.map((trip) => {
                const meta = TRIP_META[trip.item_type] ?? TRIP_META.tour;
                return (
                  <li key={`${trip.item_type}-${trip.item_id}`}>
                    <Link
                      href={`${meta.base}/${trip.item_id}`}
                      className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl ring-1 ring-white/10"
                    >
                      {trip.image ? (
                        <Image
                          src={trip.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${trip.gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-darkest/90 via-forest-darkest/30 to-transparent" />
                      <div className="relative z-10 p-4">
                        <span className="text-xs font-semibold uppercase tracking-wide text-mint">
                          {meta.label}
                          {trip.region ? ` · ${trip.region}` : ""}
                        </span>
                        <p className="mt-0.5 font-display text-lg font-bold leading-tight text-fog drop-shadow">
                          {trip.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-fog/60">
          {memberSince && <span>On Hike Scotland since {memberSince}</span>}
          <Link href="/" className="text-mint hover:underline">
            Explore Scotland →
          </Link>
        </div>
      </Container>
    </div>
  );
}
