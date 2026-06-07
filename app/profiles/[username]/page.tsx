import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import SocialLinks from "@/components/SocialLinks";
import { createClient } from "@/lib/supabase/server";
import { heroImage } from "@/lib/heroImage";
import { normalizeUsername, type Socials } from "@/lib/profile";

// Profile ändern sich selten; kurze ISR statt force-dynamic.
export const revalidate = 60;

type PublicProfile = {
  username: string;
  display_name: string | null;
  bio: string | null;
  website: string | null;
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
    .select("username, display_name, bio, website, location, avatar_url, socials, created_at")
    .eq("username", key)
    .maybeSingle();

  if (!data?.username) return null;
  return {
    username: data.username,
    display_name: data.display_name,
    bio: data.bio,
    website: data.website,
    location: data.location,
    avatar_url: data.avatar_url,
    socials: (data.socials ?? {}) as Socials,
    created_at: data.created_at,
  };
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

        <Container py="standard">
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
      <Container py="compact" size="4xl">
        {profile.bio && (
          <p className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-fog/85">
            {profile.bio}
          </p>
        )}

        <div className="mt-8">
          <SocialLinks socials={profile.socials} website={profile.website} />
        </div>

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
