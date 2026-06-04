import Image from "next/image";
import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

/**
 * Full-bleed cinematic hero for the marketing pages (landing + destinations).
 * Photo background, dark bottom-heavy gradient, oversized display title.
 */
export default function CinematicHero({
  image,
  alt = "",
  eyebrow,
  title,
  subtitle,
  topSlot,
  children,
  size = "lg",
}: {
  /** Already-resolved image URL (e.g. from heroImage()). */
  image: string;
  alt?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Pinned to the top of the hero (breadcrumb, stats row…). */
  topSlot?: ReactNode;
  /** Actions / CTAs rendered under the subtitle. */
  children?: ReactNode;
  /** lg ≈ full-screen landing hero, md ≈ shorter subpage hero. */
  size?: "lg" | "md";
}) {
  const minH = size === "lg" ? "min-h-[88vh]" : "min-h-[68vh]";

  return (
    <section className="relative isolate overflow-hidden bg-forest-darkest text-fog">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover animate-hero-zoom"
      />
      {/* Bottom-heavy wash keeps the headline legible; a faint top wash blends the navbar. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest via-forest-darkest/65 to-forest-darkest/25" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-forest-darkest/70 to-transparent" />

      <div
        className={`mx-auto flex ${minH} max-w-7xl flex-col px-4 pb-14 pt-8 sm:px-6 sm:pb-20 lg:px-8`}
      >
        {topSlot ? <div className="animate-fade-up">{topSlot}</div> : <span aria-hidden />}

        <div className="mt-auto max-w-4xl animate-fade-up">
          {eyebrow && (
            <Eyebrow tone="mint" dash>
              {eyebrow}
            </Eyebrow>
          )}
          <h1 className="mt-5 font-display font-bold leading-[1.04] tracking-[-0.01em] text-fog text-[clamp(2.75rem,8vw,7.5rem)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog/85 sm:text-xl">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
      </div>
    </section>
  );
}
