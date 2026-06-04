import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  /**
   * Brand accent. Use "mist" on light surfaces (white / fog) and "mint" on
   * dark surfaces (forest / hero imagery), where the lighter green reads better.
   */
  tone?: "mist" | "mint";
  /** Render a short leading rule before the label. */
  dash?: boolean;
  /** Extra classes for alignment (e.g. "justify-center") or margins. */
  className?: string;
};

/**
 * The small uppercase kicker that sits above a heading. One canonical style —
 * `text-sm font-semibold uppercase tracking-[0.25em]` — so every section eyebrow
 * matches. Pick the tone for the surface; add `dash` for the ruled variant.
 */
export default function Eyebrow({
  children,
  tone = "mist",
  dash = false,
  className = "",
}: EyebrowProps) {
  const text = tone === "mint" ? "text-mint" : "text-mist";
  const rule = tone === "mint" ? "bg-mint/60" : "bg-mist/60";

  return (
    <p
      className={`text-sm font-semibold uppercase tracking-[0.25em] ${text} ${
        dash ? "flex items-center gap-3" : ""
      } ${className}`}
    >
      {dash && <span aria-hidden className={`h-px w-8 ${rule}`} />}
      {children}
    </p>
  );
}
