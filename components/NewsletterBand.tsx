"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";

/**
 * Compact newsletter section shown above the footer on every page. The
 * dedicated /newsletter page already leads with the full form, so we skip
 * the band there to avoid two sign-up forms on one page.
 */
export default function NewsletterBand() {
  const pathname = usePathname();
  if (pathname === "/newsletter") return null;

  return (
    <section className="relative isolate overflow-hidden bg-forest-darkest text-fog">
      <Image
        src="/heroes/highlands.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest via-forest-darkest/70 to-forest-darkest/40"
      />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-mint">
            <span aria-hidden className="h-px w-8 bg-mint/60" />
            News from the trail
          </p>
          <h2 className="mt-5 font-display font-bold leading-[1.05] text-fog text-[clamp(1.75rem,4vw,2.75rem)]">
            Never miss a walk worth taking.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-fog/80">
            New routes, guided tours and seasonal highlights from across
            Scotland — straight to your inbox, a few times a season.
          </p>
        </div>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
