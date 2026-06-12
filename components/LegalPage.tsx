import type { ReactNode } from "react";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";

/**
 * Shared chrome for the legal pages (/privacy, /legal-notice, /terms): a dark
 * forest-gradient header band over a light prose body — mirrors /credits so the
 * functional pages stay visually consistent.
 */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <Container size="3xl" py="compact">
          <Eyebrow tone="mint" dash>
            {eyebrow}
          </Eyebrow>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">{intro}</p>
          {lastUpdated && (
            <p className="mt-4 text-sm text-fog/60">Last updated: {lastUpdated}</p>
          )}
        </Container>
      </header>

      <Container size="3xl" py="compact" className="space-y-8">
        {children}

        <p className="border-t border-softgray/40 pt-6 text-sm italic leading-relaxed text-neutralgray">
          This is template text provided for a demonstration project and does not
          constitute legal advice. Replace it with content reviewed for your
          jurisdiction before relying on it.
        </p>
      </Container>
    </>
  );
}

/** A titled section within a legal page. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold text-forest-darkest">
        {title}
      </h2>
      <div className="space-y-3 leading-relaxed text-neutralgray">{children}</div>
    </section>
  );
}
