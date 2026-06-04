import type { ElementType, ReactNode } from "react";

/** Max content width. 7xl is the standard full-width page container. */
type Size = "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

/**
 * Section vertical rhythm. Three tiers cover the site:
 *  - compact   — sub-page content (index lists, detail bodies, footers)
 *  - standard  — major marketing sections
 *  - dramatic  — hero-adjacent statement sections
 * Use "none" and pass padding via className for bespoke seams (e.g. pb-only
 * sections that butt against the one above).
 */
type Spacing = "none" | "compact" | "standard" | "dramatic";

const WIDTH: Record<Size, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

const PADDING: Record<Spacing, string> = {
  none: "",
  compact: "py-12",
  standard: "py-20 lg:py-28",
  dramatic: "py-28 lg:py-44",
};

/**
 * Centered page container — owns the one canonical horizontal gutter
 * (`px-4 sm:px-6 lg:px-8`) so it never drifts, plus the max-width and the
 * vertical spacing scale. Extra classes (text alignment, grid, space-y…)
 * pass through via `className`.
 */
export default function Container({
  children,
  size = "7xl",
  py = "none",
  as,
  id,
  className = "",
}: {
  children: ReactNode;
  size?: Size;
  py?: Spacing;
  /** Render element — defaults to a plain div. */
  as?: ElementType;
  id?: string;
  className?: string;
}) {
  const Tag = as ?? "div";
  return (
    <Tag
      id={id}
      className={`mx-auto ${WIDTH[size]} px-4 sm:px-6 lg:px-8 ${PADDING[py]} ${className}`}
    >
      {children}
    </Tag>
  );
}
