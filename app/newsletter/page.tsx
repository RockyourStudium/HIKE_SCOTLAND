import type { Metadata } from "next";
import Image from "next/image";
import NewsletterForm from "@/components/NewsletterForm";
import { heroImage } from "@/lib/heroImage";

export const metadata: Metadata = {
  title: "Newsletter — Hike Scotland",
  description:
    "Subscribe to the Hike Scotland newsletter for fresh routes, guided tours and seasonal highlights from the Highlands and beyond.",
};

export default function NewsletterPage() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-forest-darkest text-fog">
      <Image
        src={heroImage("highlands")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover animate-hero-zoom"
      />
      {/* Same bottom-heavy wash as the cinematic hero, plus a faint top blend for the navbar. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest via-forest-darkest/70 to-forest-darkest/40" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-forest-darkest/70 to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:py-32 lg:px-8">
        <div>
          <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-mint">
            <span aria-hidden className="h-px w-8 bg-mint/60" />
            News from the trail
          </p>

          <h1 className="mt-6 font-display font-bold leading-[1.04] tracking-[-0.01em] text-fog text-[clamp(2.5rem,6vw,4.5rem)]">
            Never miss a
            <br className="hidden sm:block" /> walk worth taking.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-fog/85">
            Get new routes, guided tours and seasonal highlights from across
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
