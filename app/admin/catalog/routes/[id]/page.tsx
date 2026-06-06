import { notFound } from "next/navigation";
import {
  getRoute,
  linesFromJson,
  REGIONS,
  DIFFICULTIES,
  TERRAINS,
  SEASONS,
} from "@/lib/admin/catalog";
import { PageHeading, BackLink } from "@/components/admin/ui";
import {
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  CheckboxField,
  MultiCheckboxField,
} from "@/components/admin/form";
import { saveRoute } from "../actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  required: { tone: "err", text: "Please fill in the required fields." },
  dup: { tone: "err", text: "A route with this ID already exists." },
  db: { tone: "err", text: "Database error — please try again." },
};

function asStrings(j: unknown): string[] {
  return Array.isArray(j) ? (j as unknown[]).map(String) : [];
}

export default async function RouteEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ok?: string; err?: string };
}) {
  const isNew = params.id === "new";
  const route = isNew ? null : await getRoute(params.id);
  if (!isNew && !route) notFound();
  const banner = BANNERS[searchParams.err ?? ""];

  return (
    <>
      <div className="mb-4">
        <BackLink href="/admin/catalog/routes" label="Back to routes" />
      </div>
      <PageHeading title={isNew ? "New route" : (route?.name ?? "Route")} />

      {banner ? (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger">
          {banner.text}
        </div>
      ) : null}

      <form
        action={saveRoute}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-card"
      >
        <input type="hidden" name="original_id" value={route?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="ID (slug)"
            name="id"
            defaultValue={route?.id}
            required
            readOnly={!isNew}
            placeholder="e.g. ben-lomond"
            hint={isNew ? "Lowercase, words-with-hyphens. Cannot be changed later." : undefined}
          />
          <TextField label="Name" name="name" defaultValue={route?.name} required />
          <SelectField label="Region" name="region" defaultValue={route?.region} options={REGIONS} required />
          <SelectField label="Difficulty" name="difficulty" defaultValue={route?.difficulty} options={DIFFICULTIES} required />
          <NumberField label="Distance (km)" name="distance_km" defaultValue={route?.distance_km} min={0} step="0.1" required />
          <NumberField label="Ascent (m)" name="ascent_m" defaultValue={route?.ascent_m} min={0} step="1" required />
          <NumberField label="Duration (hours)" name="duration_hours" defaultValue={route?.duration_hours} min={0} step="0.1" required />
          <NumberField label="Days" name="days" defaultValue={route?.days} min={1} step="1" required />
          <NumberField label="Latitude" name="lat" defaultValue={route?.lat} required />
          <NumberField label="Longitude" name="lng" defaultValue={route?.lng} required />
          <TextField label="Image path" name="image" defaultValue={route?.image ?? ""} placeholder="/cards/…jpg" />
          <TextField label="Gradient classes" name="gradient" defaultValue={route?.gradient ?? ""} placeholder="from-forest-dark to-mist" />
        </div>

        <MultiCheckboxField label="Terrain" name="terrain" options={TERRAINS} selected={asStrings(route?.terrain)} />
        <MultiCheckboxField label="Seasons" name="seasons" options={SEASONS} selected={asStrings(route?.seasons)} />

        <TextareaField label="Summary" name="summary" defaultValue={route?.summary} required rows={2} />
        <TextareaField
          label="Description"
          name="description"
          defaultValue={linesFromJson(route?.description)}
          rows={5}
          hint="One paragraph per line."
        />
        <TextareaField
          label="Highlights"
          name="highlights"
          defaultValue={linesFromJson(route?.highlights)}
          rows={4}
          hint="One item per line."
        />

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <CheckboxField label="Dog friendly" name="dog_friendly" defaultChecked={route?.dog_friendly ?? false} />
          <CheckboxField
            label="Active (visible on the site)"
            name="active"
            defaultChecked={route?.active ?? true}
          />
        </div>

        <div className="border-t border-mint/30 pt-4">
          <button
            type="submit"
            className="rounded-full bg-forest-highland px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            {isNew ? "Create route" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}
