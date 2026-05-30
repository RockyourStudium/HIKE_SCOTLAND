import Link from "next/link";
import type { ReactNode } from "react";

type AnimatedCTAProps = {
  children: ReactNode;
  /** Render as a link when provided, otherwise a <button>. */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
  /** Full-width pill. */
  block?: boolean;
  /** Compact padding for tight spaces like the navbar. */
  size?: "sm" | "md";
  /** Extra classes for the outer element (margins, alignment, etc.). */
  className?: string;
  "aria-label"?: string;
};

/**
 * Primary call-to-action with a rotating gradient border and a shimmering
 * label — our forest-palette take on the SheCodes footer effect.
 * Falls back to a calm, static, muted pill when `disabled`.
 */
export default function AnimatedCTA({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  target,
  rel,
  block = false,
  size = "md",
  className = "",
  "aria-label": ariaLabel,
}: AnimatedCTAProps) {
  if (disabled) {
    return (
      <button
        type={type}
        disabled
        aria-label={ariaLabel}
        className={`cta-disabled ${block ? "cta-block" : ""} ${className}`}
      >
        {children}
      </button>
    );
  }

  const outerClass = `cta-animated ${size === "sm" ? "cta-sm" : ""} ${
    block ? "cta-block" : ""
  } ${className}`;
  const inner = (
    <span className="cta-animated-inner">
      <span className="cta-shimmer">{children}</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} aria-label={ariaLabel} className={outerClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={outerClass}>
      {inner}
    </button>
  );
}
