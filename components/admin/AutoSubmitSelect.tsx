"use client";

import { useRef } from "react";

/**
 * Inline-Status-Auswahl, die ihre Server-Action sofort bei Änderung absendet.
 * Wird für Subscriber- und Buchungs-Status wiederverwendet. Die `action` wird
 * als Server-Action-Prop übergeben; versteckte Felder (`id`, optional `field`)
 * reisen mit.
 */
export default function AutoSubmitSelect({
  action,
  id,
  field,
  value,
  options,
  ariaLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  field?: string;
  value: string;
  options: readonly string[];
  ariaLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      {field ? <input type="hidden" name="field" value={field} /> : null}
      <select
        name="status"
        defaultValue={value}
        aria-label={ariaLabel}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-mint/60 bg-white px-2 py-1 text-xs font-medium text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
