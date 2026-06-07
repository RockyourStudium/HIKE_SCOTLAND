import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle, ExternalLink, Globe } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import AvatarUpload from "@/components/AvatarUpload";
import CopyLinkButton from "@/components/CopyLinkButton";
import { createClient } from "@/lib/supabase/server";
import { SOCIAL_PLATFORMS, type Socials } from "@/lib/profile";
import { updatePublicProfile, uploadAvatar, resetAvatar } from "./actions";

export const dynamic = "force-dynamic";

const FIELD =
  "w-full rounded-lg border border-mint/60 px-3 py-2 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland";
const LABEL = "block text-sm font-medium text-forest-dark";

const ERRORS: Record<string, string> = {
  username_format:
    "Usernames use 3–30 lowercase letters, numbers, hyphens or underscores.",
  username_reserved: "That username isn’t available.",
  username_taken: "That username is already taken.",
  public_needs_username: "Pick a username before making your profile public.",
  website_invalid: "Please enter a valid website URL.",
  avatar_missing: "Choose an image first.",
  avatar_type: "That file isn’t a supported image.",
  avatar_size: "That image is too large (max 5 MB).",
  avatar_save: "Couldn’t save your avatar. Please try again.",
  save: "Couldn’t save your changes. Please try again.",
};

export default async function PublicProfilePage({
  searchParams,
}: {
  searchParams: { saved?: string; err?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, is_public, show_trips, bio, website, location, avatar_url, socials")
    .eq("id", user.id)
    .single();

  const socials = (profile?.socials ?? {}) as Socials;
  const saved = searchParams.saved;
  const errMsg = searchParams.err ? ERRORS[searchParams.err] : null;

  const fallbackInitial =
    (profile?.display_name || user.email || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <Container size="3xl" py="compact">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-bold text-forest-darkest">
          Public profile
        </h1>
        <Link
          href="/account"
          className="text-sm font-medium text-forest-highland hover:underline"
        >
          ← Account
        </Link>
      </div>
      <p className="mt-1 text-sm text-neutralgray">
        Share as much or as little as you like. Your profile stays private until
        you switch it on.
      </p>

      {saved && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-mint/30 px-4 py-3 text-sm text-forest-dark">
          <CheckCircle2 aria-hidden className="h-4 w-4 text-forest-highland" />
          {saved === "avatar" ? "Avatar updated." : "Changes saved."}
        </div>
      )}
      {errMsg && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle aria-hidden className="h-4 w-4" />
          {errMsg}
        </div>
      )}

      {profile?.is_public && profile.username && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-fog px-4 py-3">
          <Link
            href={`/profiles/${profile.username}`}
            target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-forest-dark hover:underline"
          >
            <ExternalLink aria-hidden className="h-4 w-4 text-forest-highland" strokeWidth={2} />
            Your profile is live at /profiles/{profile.username}
          </Link>
          <CopyLinkButton path={`/profiles/${profile.username}`} />
        </div>
      )}

      {/* Avatar */}
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="font-display text-xl font-bold text-forest-darkest">Avatar</h2>
        <p className="mt-1 mb-4 text-sm text-neutralgray">
          We use your Google photo by default. Upload your own to override it.
        </p>
        <AvatarUpload
          currentAvatar={profile?.avatar_url ?? null}
          fallback={fallbackInitial}
          uploadAction={uploadAvatar}
          resetAction={resetAvatar}
        />
      </section>

      {/* Profil-Felder */}
      <form
        action={updatePublicProfile}
        className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-card"
      >
        {/* Sichtbarkeit */}
        <label className="flex items-start gap-3 rounded-lg bg-fog/60 p-4">
          <input
            type="checkbox"
            name="is_public"
            defaultChecked={profile?.is_public ?? false}
            className="mt-0.5 h-4 w-4 rounded border-mint/60 text-forest-highland focus:ring-forest-highland"
          />
          <span>
            <span className="block text-sm font-medium text-forest-dark">
              Make my profile public
            </span>
            <span className="block text-xs text-neutralgray">
              Anyone with the link can see the fields below. Needs a username.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg bg-fog/60 p-4">
          <input
            type="checkbox"
            name="show_trips"
            defaultChecked={profile?.show_trips ?? false}
            className="mt-0.5 h-4 w-4 rounded border-mint/60 text-forest-highland focus:ring-forest-highland"
          />
          <span>
            <span className="block text-sm font-medium text-forest-dark">
              Show my booked trips
            </span>
            <span className="block text-xs text-neutralgray">
              Lists the names of your booked tours, routes and stays on your public
              profile (no dates or prices). Only applies when your profile is public.
            </span>
          </span>
        </label>

        <div className="space-y-1.5">
          <label htmlFor="username" className={LABEL}>
            Username
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutralgray">/profiles/</span>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={profile?.username ?? ""}
              placeholder="fiona"
              className={FIELD}
            />
          </div>
          <p className="text-xs text-neutralgray">
            3–30 characters: lowercase letters, numbers, hyphens, underscores.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="display_name" className={LABEL}>
            Display name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            defaultValue={profile?.display_name ?? ""}
            placeholder="The name shown on your public profile"
            className={FIELD}
          />
          <p className="text-xs text-neutralgray">
            Separate from the name we use for bookings — that one stays private.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className={LABEL}>
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={profile?.location ?? ""}
            placeholder="e.g. Edinburgh, Scotland"
            className={FIELD}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bio" className={LABEL}>
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            maxLength={600}
            defaultValue={profile?.bio ?? ""}
            placeholder="A few words about you and your favourite trails."
            className={FIELD}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="website" className={LABEL}>
            Website
          </label>
          <div className="relative">
            <Globe
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist"
              strokeWidth={2}
            />
            <input
              id="website"
              name="website"
              type="text"
              defaultValue={profile?.website ?? ""}
              placeholder="yoursite.com"
              className={`${FIELD} pl-9`}
            />
          </div>
        </div>

        {/* Social-Links */}
        <fieldset className="space-y-3">
          <legend className={LABEL}>Social links</legend>
          {SOCIAL_PLATFORMS.map(({ key, label, baseUrl, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-24 flex-shrink-0 text-sm text-neutralgray">{label}</span>
              <span className="hidden text-xs text-neutralgray sm:inline">
                {baseUrl.replace(/^https?:\/\//, "")}
              </span>
              <input
                name={`social_${key}`}
                type="text"
                defaultValue={socials[key] ?? ""}
                placeholder={placeholder}
                className={FIELD}
              />
            </div>
          ))}
        </fieldset>

        <div className="pt-2">
          <Button type="submit">Save profile</Button>
        </div>
      </form>
    </Container>
  );
}
