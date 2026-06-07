"use client";

import { useRef, useState } from "react";
import { Upload, RotateCcw } from "lucide-react";
import { buttonClasses } from "@/components/Button";

/**
 * Avatar-Block im Profil-Editor: zeigt das aktuelle Bild, erlaubt Auswahl einer
 * Datei mit Live-Vorschau und reicht sie an die Server Action `uploadAction`
 * weiter. `resetAction` stellt das Google-Bild wieder her. Beide Actions kommen
 * als Props aus der Server-Seite.
 */
export default function AvatarUpload({
  currentAvatar,
  fallback,
  uploadAction,
  resetAction,
}: {
  currentAvatar: string | null;
  fallback: string;
  uploadAction: (formData: FormData) => void;
  resetAction: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shown = preview ?? currentAvatar;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <span className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint text-2xl font-bold text-forest-darkest">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="h-full w-full object-cover" />
        ) : (
          fallback
        )}
      </span>

      <div className="space-y-3">
        <form action={uploadAction} className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            name="avatar"
            accept="image/*"
            className="block max-w-[14rem] text-sm text-neutralgray file:mr-3 file:rounded-full file:border-0 file:bg-fog file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-forest-dark hover:file:bg-mint/40"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setPreview(URL.createObjectURL(f));
                setFileName(f.name);
              } else {
                setPreview(null);
                setFileName(null);
              }
            }}
          />
          <button
            type="submit"
            disabled={!fileName}
            className={`${buttonClasses()} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <Upload aria-hidden className="h-4 w-4" strokeWidth={2} />
            Upload
          </button>
        </form>

        <form action={resetAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutralgray transition-colors hover:text-forest-dark"
          >
            <RotateCcw aria-hidden className="h-4 w-4" strokeWidth={2} />
            Reset to Google photo
          </button>
        </form>

        <p className="text-xs text-neutralgray">
          JPG, PNG or WebP — square works best. Max 5 MB.
        </p>
      </div>
    </div>
  );
}
