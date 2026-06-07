import { notFound } from "next/navigation";
import { getProfile, ROLES } from "@/lib/admin/queries";
import { PageHeading, BackLink, formatDate } from "@/components/admin/ui";
import {
  TextField,
  TextareaField,
  SelectField,
} from "@/components/admin/form";
import { updateProfileFields } from "../actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  saved: { tone: "ok", text: "Profile saved." },
  email: { tone: "err", text: "Invalid email address." },
  dup: { tone: "err", text: "That email is already in use." },
  self: { tone: "err", text: "You can’t remove your own admin role." },
  role: { tone: "err", text: "Invalid role." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function ProfileDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ok?: string; err?: string };
}) {
  const profile = await getProfile(params.id);
  if (!profile) notFound();

  const banner =
    BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <div className="mb-4">
        <BackLink href="/admin/profiles" label="Back to profiles" />
      </div>

      <PageHeading
        title={profile.name ?? "Profile"}
        subtitle={`Joined ${formatDate(profile.created_at)} · ${profile.bookingCount} booking${
          profile.bookingCount === 1 ? "" : "s"
        }`}
      />

      {banner ? (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            banner.tone === "ok"
              ? "bg-fog text-forest-dark"
              : "bg-danger/10 text-danger"
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <form
        action={updateProfileFields}
        className="max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-card"
      >
        <input type="hidden" name="id" value={profile.id} />

        <TextField label="Name" name="name" defaultValue={profile.name ?? ""} />
        <TextField
          label="Email"
          name="email"
          defaultValue={profile.email ?? ""}
          hint="Contact email used for bookings & newsletter."
        />
        <TextField label="Phone" name="phone" defaultValue={profile.phone ?? ""} />
        <TextareaField
          label="Address"
          name="address"
          defaultValue={profile.address ?? ""}
        />
        <SelectField
          label="Role"
          name="role"
          defaultValue={profile.role}
          options={ROLES}
        />

        <div className="pt-2">
          <button
            type="submit"
            className="rounded-full bg-forest-highland px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Save changes
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-neutralgray">User ID: {profile.id}</p>
    </>
  );
}
