// Wiederverwendbare Formularfelder fürs Katalog-CRUD. Reine Server-Komponenten
// (native Inputs, kein State) — funktionieren in <form action={serverAction}>.

const inputCls =
  "mt-1 w-full rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland";

function Hint({ text }: { text?: string }) {
  return text ? (
    <span className="mt-0.5 block text-[11px] text-neutralgray">{text}</span>
  ) : null;
}

export function TextField({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  readOnly,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutralgray">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inputCls}${readOnly ? " bg-neutral-50 text-neutralgray" : ""}`}
      />
      <Hint text={hint} />
    </label>
  );
}

export function NumberField({
  label,
  name,
  defaultValue,
  step = "any",
  min,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: number | null;
  step?: string;
  min?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutralgray">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue ?? undefined}
        step={step}
        min={min}
        required={required}
        className={inputCls}
      />
      <Hint text={hint} />
    </label>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue,
  rows = 3,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutralgray">
        {label}
        {required ? " *" : ""}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className={inputCls}
      />
      <Hint text={hint} />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutralgray">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={`${inputCls} bg-white`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-2">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-mint/60 text-forest-highland focus:ring-forest-highland"
      />
      <span>
        <span className="text-sm font-medium text-forest-dark">{label}</span>
        <Hint text={hint} />
      </span>
    </label>
  );
}

export function MultiCheckboxField({
  label,
  name,
  options,
  selected,
}: {
  label: string;
  name: string;
  options: readonly string[];
  selected: string[];
}) {
  return (
    <fieldset className="block">
      <legend className="text-xs font-medium text-neutralgray">{label}</legend>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-1.5">
            <input
              type="checkbox"
              name={name}
              value={o}
              defaultChecked={selected.includes(o)}
              className="h-4 w-4 rounded border-mint/60 text-forest-highland focus:ring-forest-highland"
            />
            <span className="text-sm text-forest-dark">{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
