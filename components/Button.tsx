import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Secondary action styles. The primary CTA is its own thing — see AnimatedCTA.
 *  - secondary — solid forest pill (on light surfaces)
 *  - outline   — forest outline that fills on hover (on light surfaces)
 *  - ghost     — faint fog outline (on dark / photographic surfaces)
 */
export type ButtonVariant = "secondary" | "outline" | "ghost";
type Size = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors";

const SIZE: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-base",
};

/** Colour + hover per variant. Exported so stateful controls can share it. */
export const buttonVariants: Record<ButtonVariant, string> = {
  secondary: "bg-forest-highland text-white hover:bg-forest-dark",
  outline:
    "border border-forest-highland text-forest-highland hover:bg-forest-highland hover:text-white",
  ghost: "border border-fog/30 text-fog hover:bg-white/10",
};

export function buttonClasses({
  variant = "secondary",
  size = "sm",
  block = false,
}: { variant?: ButtonVariant; size?: Size; block?: boolean } = {}) {
  return `${BASE} ${SIZE[size]} ${buttonVariants[variant]} ${block ? "w-full" : ""}`;
}

/**
 * Polymorphic secondary button. Renders a <Link> when `href` is set, a
 * non-interactive <span> when `as="span"` (e.g. a fake button inside a card
 * link), otherwise a <button>.
 */
export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "secondary",
  size = "sm",
  block = false,
  as,
  target,
  rel,
  className = "",
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  size?: Size;
  block?: boolean;
  /** Force a non-interactive span (for use inside another link/button). */
  as?: "span";
  target?: string;
  rel?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const cls = `${buttonClasses({ variant, size, block })} ${className}`;

  if (as === "span") {
    return <span className={cls}>{children}</span>;
  }
  if (href) {
    return (
      <Link href={href} target={target} rel={rel} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
