import { notFound } from "next/navigation";
import {
  getTour,
  listDeparturesForTour,
  linesFromJson,
  REGIONS,
  DIFFICULTIES,
  DEPARTURE_STATUSES,
} from "@/lib/admin/catalog";
import { PageHeading, BackLink } from "@/components/admin/ui";
import {
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  CheckboxField,
} from "@/components/admin/form";
import { saveTour, saveDeparture, deleteDeparture } from "../actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  dep_saved: { tone: "ok", text: "Departure saved." },
  dep_deleted: { tone: "ok", text: "Departure deleted." },
  required: { tone: "err", text: "Please fill in the required fields." },
  dep_required: { tone: "err", text: "Departure needs a date." },
  dup: { tone: "err", text: "A tour with this ID already exists." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function TourEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ok?: string; err?: string };
}) {
  const isNew = params.id === "new";
  const tour = isNew ? null : await getTour(params.id);
  if (!isNew && !tour) notFound();

  const departures = tour ? await listDeparturesForTour(tour.id) : [];
  const banner = BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <div className="mb-4">
        <BackLink href="/admin/catalog/tours" label="Back to tours" />
      </div>
      <PageHeading title={isNew ? "New tour" : (tour?.name ?? "Tour")} />

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
        action={saveTour}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-card"
      >
        <input type="hidden" name="original_id" value={tour?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="ID (slug)"
            name="id"
            defaultValue={tour?.id}
            required
            readOnly={!isNew}
            placeholder="e.g. ben-lomond-guided-ascent"
            hint={isNew ? "Lowercase, words-with-hyphens. Cannot be changed later." : undefined}
          />
          <TextField label="Name" name="name" defaultValue={tour?.name} required />
          <SelectField
            label="Region"
            name="region"
            defaultValue={tour?.region}
            options={REGIONS}
            required
          />
          <SelectField
            label="Difficulty"
            name="difficulty"
            defaultValue={tour?.difficulty}
            options={DIFFICULTIES}
            required
          />
          <NumberField label="Days" name="days" defaultValue={tour?.days} min={1} step="1" required />
          <TextField label="Group size" name="group_size" defaultValue={tour?.group_size} required />
          <NumberField
            label="Price per person (GBP)"
            name="price_per_person"
            defaultValue={tour ? Number(tour.price_per_person) : undefined}
            min={0}
            step="0.01"
            required
          />
          <NumberField label="Latitude" name="lat" defaultValue={tour?.lat} required />
          <NumberField label="Longitude" name="lng" defaultValue={tour?.lng} required />
          <TextField label="Image path" name="image" defaultValue={tour?.image ?? ""} placeholder="/cards/…jpg" />
          <TextField label="Gradient classes" name="gradient" defaultValue={tour?.gradient ?? ""} placeholder="from-forest-dark to-mist" />
        </div>

        <TextareaField label="Summary" name="summary" defaultValue={tour?.summary} required rows={2} />
        <TextareaField
          label="Description"
          name="description"
          defaultValue={linesFromJson(tour?.description)}
          rows={5}
          hint="One paragraph per line."
        />
        <TextareaField
          label="Includes"
          name="includes"
          defaultValue={linesFromJson(tour?.includes)}
          rows={4}
          hint="One item per line."
        />

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <CheckboxField label="Guided" name="guided" defaultChecked={tour?.guided ?? true} />
          <CheckboxField
            label="Active (visible on the site)"
            name="active"
            defaultChecked={tour?.active ?? true}
          />
        </div>

        <div className="border-t border-mint/30 pt-4">
          <button
            type="submit"
            className="rounded-full bg-forest-highland px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            {isNew ? "Create tour" : "Save changes"}
          </button>
        </div>
      </form>

      {/* Termine — nur für gespeicherte Touren */}
      {tour ? (
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-forest-darkest">
            Departures ({departures.length})
          </h2>

          {departures.length > 0 ? (
            <div className="mb-4 space-y-2">
              {departures.map((d) => (
                <form
                  key={d.id}
                  action={saveDeparture}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-mint/30 p-3"
                >
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="tour_id" value={tour.id} />
                  <label className="flex flex-col text-xs font-medium text-neutralgray">
                    Date
                    <input
                      type="date"
                      name="departure_date"
                      defaultValue={d.departure_date}
                      className="mt-1 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutralgray">
                    Capacity
                    <input
                      type="number"
                      name="capacity"
                      min={0}
                      defaultValue={d.capacity}
                      className="mt-1 w-24 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutralgray">
                    Seats left
                    <input
                      type="number"
                      name="seats_remaining"
                      min={0}
                      defaultValue={d.seats_remaining}
                      className="mt-1 w-24 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutralgray">
                    Price override
                    <input
                      type="number"
                      name="price_per_person"
                      min={0}
                      step="0.01"
                      defaultValue={d.price_per_person ?? undefined}
                      placeholder="catalog"
                      className="mt-1 w-28 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutralgray">
                    Status
                    <select
                      name="status"
                      defaultValue={d.status}
                      className="mt-1 rounded-lg border border-mint/60 bg-white px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                    >
                      {DEPARTURE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-forest-highland px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    formAction={deleteDeparture}
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Delete
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-sm text-neutralgray">No departures yet.</p>
          )}

          {/* Neuer Termin */}
          <form
            action={saveDeparture}
            className="flex flex-wrap items-end gap-3 border-t border-mint/20 pt-4"
          >
            <input type="hidden" name="tour_id" value={tour.id} />
            <label className="flex flex-col text-xs font-medium text-neutralgray">
              Date
              <input
                type="date"
                name="departure_date"
                required
                className="mt-1 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutralgray">
              Capacity
              <input
                type="number"
                name="capacity"
                min={0}
                defaultValue={8}
                className="mt-1 w-24 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutralgray">
              Seats left
              <input
                type="number"
                name="seats_remaining"
                min={0}
                defaultValue={8}
                className="mt-1 w-24 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutralgray">
              Price override
              <input
                type="number"
                name="price_per_person"
                min={0}
                step="0.01"
                placeholder="catalog"
                className="mt-1 w-28 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
              />
            </label>
            <button
              type="submit"
              className="rounded-full border border-forest-highland px-4 py-1.5 text-sm font-semibold text-forest-highland hover:bg-fog"
            >
              + Add departure
            </button>
          </form>
        </div>
      ) : (
        <p className="mt-4 text-sm text-neutralgray">
          Save the tour first to manage its departures.
        </p>
      )}
    </>
  );
}
