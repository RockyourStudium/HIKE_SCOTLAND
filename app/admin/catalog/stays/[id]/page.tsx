import { notFound } from "next/navigation";
import {
  getStay,
  linesFromJson,
  REGIONS,
  STAY_TYPES,
} from "@/lib/admin/catalog";
import { PageHeading, BackLink } from "@/components/admin/ui";
import {
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  CheckboxField,
} from "@/components/admin/form";
import { saveStay } from "../actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  required: { tone: "err", text: "Please fill in the required fields." },
  dup: { tone: "err", text: "A stay with this ID already exists." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function StayEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ok?: string; err?: string };
}) {
  const isNew = params.id === "new";
  const stay = isNew ? null : await getStay(params.id);
  if (!isNew && !stay) notFound();
  const banner = BANNERS[searchParams.err ?? ""];

  return (
    <>
      <div className="mb-4">
        <BackLink href="/admin/catalog/stays" label="Back to stays" />
      </div>
      <PageHeading title={isNew ? "New stay" : (stay?.name ?? "Stay")} />

      {banner ? (
        <div className="mb-4 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger">
          {banner.text}
        </div>
      ) : null}

      <form
        action={saveStay}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-card"
      >
        <input type="hidden" name="original_id" value={stay?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="ID (slug)"
            name="id"
            defaultValue={stay?.id}
            required
            readOnly={!isNew}
            placeholder="e.g. corrour-bothy"
            hint={isNew ? "Lowercase, words-with-hyphens. Cannot be changed later." : undefined}
          />
          <TextField label="Name" name="name" defaultValue={stay?.name} required />
          <SelectField label="Type" name="type" defaultValue={stay?.type} options={STAY_TYPES} required />
          <SelectField label="Region" name="region" defaultValue={stay?.region} options={REGIONS} required />
          <NumberField label="Price per night (GBP)" name="price_per_night" defaultValue={stay ? Number(stay.price_per_night) : undefined} min={0} step="0.01" required />
          <NumberField label="Rating (0–5)" name="rating" defaultValue={stay ? Number(stay.rating) : undefined} min={0} step="0.1" required />
          <NumberField label="Max guests" name="max_guests" defaultValue={stay?.max_guests} min={1} step="1" required />
          <NumberField label="Latitude" name="lat" defaultValue={stay?.lat} required />
          <NumberField label="Longitude" name="lng" defaultValue={stay?.lng} required />
          <TextField label="Gradient classes" name="gradient" defaultValue={stay?.gradient ?? ""} placeholder="from-forest-dark to-mist" />
        </div>

        <TextareaField label="Summary" name="summary" defaultValue={stay?.summary} required rows={2} />
        <TextareaField
          label="Amenities"
          name="amenities"
          defaultValue={linesFromJson(stay?.amenities)}
          rows={4}
          hint="One amenity per line."
        />

        <div className="pt-1">
          <CheckboxField
            label="Active (visible on the site)"
            name="active"
            defaultChecked={stay?.active ?? true}
          />
        </div>

        <div className="border-t border-mint/30 pt-4">
          <button
            type="submit"
            className="rounded-full bg-forest-highland px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            {isNew ? "Create stay" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}
