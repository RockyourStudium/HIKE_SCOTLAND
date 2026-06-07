"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const FIELD =
  "w-full rounded-lg border border-mint/60 px-3 py-2 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland";

let nextId = 0;
const rowId = () => `w${nextId++}`;

/**
 * Dynamische Liste von Website-Feldern (Add/Remove). Jedes Feld heißt `website`,
 * sodass die Server Action sie per `formData.getAll("website")` einsammelt.
 */
export default function WebsiteList({ initial }: { initial: string[] }) {
  const [rows, setRows] = useState<{ id: string; value: string }[]>(
    initial.length
      ? initial.map((value) => ({ id: rowId(), value }))
      : [{ id: rowId(), value: "" }],
  );

  const update = (id: string, value: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, value } : r)));
  const remove = (id: string) =>
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : [{ id, value: "" }]));
  const add = () => setRows((rs) => [...rs, { id: rowId(), value: "" }]);

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <input
            name="website"
            type="text"
            value={row.value}
            onChange={(e) => update(row.id, e.target.value)}
            placeholder="yoursite.com"
            className={FIELD}
          />
          <button
            type="button"
            onClick={() => remove(row.id)}
            aria-label="Remove website"
            className="flex-shrink-0 rounded-lg p-2 text-neutralgray transition-colors hover:bg-fog hover:text-danger"
          >
            <X aria-hidden className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-highland transition-colors hover:underline"
      >
        <Plus aria-hidden className="h-4 w-4" strokeWidth={2} />
        Add another website
      </button>
    </div>
  );
}
