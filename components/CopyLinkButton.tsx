"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/**
 * Kopiert die absolute Profil-URL (origin + path) in die Zwischenablage und
 * zeigt kurz eine Bestätigung. `path` ist der interne Pfad, z. B. /profiles/fiona.
 */
export default function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard-API nicht verfügbar — still ignorieren.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-forest-highland px-3 py-1.5 text-sm font-medium text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
    >
      {copied ? (
        <Check aria-hidden className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Link2 aria-hidden className="h-4 w-4" strokeWidth={2} />
      )}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
