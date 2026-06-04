import Link from "next/link";
import Image from "next/image";
import { Map, Compass, Tent } from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import Button from "@/components/Button";
import { heroImage } from "@/lib/heroImage";

// Where lost walkers most likely meant to go.
const trailheads = [
  {
    href: "/routes",
    icon: Map,
    title: "Browse routes",
    body: "Munros, glens and coastal paths for every pace.",
  },
  {
    href: "/destinations",
    icon: Compass,
    title: "Explore regions",
    body: "Six corners of the Highlands and beyond.",
  },
  {
    href: "/plan",
    icon: Tent,
    title: "Plan a trip",
    body: "Build a full itinerary in a few minutes.",
  },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-forest-darkest text-fog">
      <Image
        src={heroImage("glencoe")}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover animate-hero-zoom"
      />
      {/* Same bottom-heavy wash as the cinematic hero, plus a faint top blend for the navbar. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest via-forest-darkest/70 to-forest-darkest/40" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-forest-darkest/70 to-transparent" />

      <div className="mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <p className="flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-mint">
          <span aria-hidden className="h-px w-8 bg-mint/60" />
          404 — Off the trail
          <span aria-hidden className="h-px w-8 bg-mint/60" />
        </p>

        <h1 className="mt-6 font-display font-bold leading-[1.04] tracking-[-0.01em] text-fog text-[clamp(2.75rem,8vw,6rem)]">
          You&apos;ve wandered
          <br className="hidden sm:block" /> off the path.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fog/85 sm:text-xl">
          The page you were looking for isn&apos;t here — maybe the mist rolled
          in. Let&apos;s get you back to a marked trail.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AnimatedCTA href="/">Back to base camp</AnimatedCTA>
          <Button href="/routes" variant="ghost" size="md">
            Browse routes
          </Button>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {trailheads.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl bg-forest-darkest/55 p-6 text-left ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:ring-mint/40"
            >
              <t.icon aria-hidden className="h-8 w-8 text-mint" strokeWidth={1.75} />
              <h2 className="mt-3 font-display text-lg font-bold text-fog">{t.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-fog/75">{t.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
