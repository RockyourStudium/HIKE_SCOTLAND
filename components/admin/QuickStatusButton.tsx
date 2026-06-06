// Ein-Klick-Statuswechsel (z.B. Confirm / Reject) als schlankes Server-Form —
// nutzt dieselbe Server-Action wie das Inline-Select. Kein Client-State nötig.

const VARIANTS = {
  primary:
    "bg-forest-highland text-white hover:bg-forest-dark",
  danger:
    "border border-danger text-danger hover:bg-danger/10",
  ghost:
    "border border-mint/60 text-forest-dark hover:bg-fog",
} as const;

export default function QuickStatusButton({
  action,
  id,
  field,
  value,
  label,
  variant = "ghost",
  ariaLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  field: string;
  value: string;
  label: string;
  variant?: keyof typeof VARIANTS;
  ariaLabel?: string;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="status" value={value} />
      <button
        type="submit"
        aria-label={ariaLabel ?? label}
        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${VARIANTS[variant]}`}
      >
        {label}
      </button>
    </form>
  );
}
