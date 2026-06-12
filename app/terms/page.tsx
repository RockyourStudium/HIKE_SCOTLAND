import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern your use of Hike Scotland — bookings, content, outdoor safety and liability.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="The rules"
      title="Terms &amp; Conditions"
      intro="By using Hike Scotland you agree to these terms. Please read them — the outdoor-safety section in particular."
      lastUpdated="12 June 2026"
    >
      <LegalSection title="Acceptance">
        <p>
          By accessing or using this website you agree to be bound by these
          terms. If you do not agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="Use of the service">
        <p>
          You may use Hike Scotland to browse routes, tours and stays, plan a
          trip and make reservations. You agree not to misuse the site,
          interfere with its operation, or access it in ways that breach
          applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Bookings">
        <p>
          When you make a booking, the details you provide must be accurate.
          Availability, prices and tour dates are shown at the time of booking
          and may change. A reservation is confirmed only once we acknowledge
          it.
        </p>
      </LegalSection>

      <LegalSection title="Outdoor safety &amp; disclaimer">
        <p>
          Hiking and mountain activities carry inherent risks. Route information,
          difficulty ratings and tour descriptions are provided as guidance
          only and are not a substitute for your own judgement, preparation and
          up-to-date conditions. You are responsible for assessing your own
          fitness, equipment, the weather and your safety. We accept no
          liability for accidents, injury or loss arising from outdoor
          activities undertaken on the basis of information found here.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The content, branding and design of this site are protected. Imagery
          is licensed and credited on our{" "}
          <Link href="/credits" className="text-forest-highland underline hover:text-forest-dark">
            Image Credits
          </Link>{" "}
          page. You may not reproduce it without permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          The site is provided “as is” without warranties of any kind. To the
          extent permitted by law, we are not liable for indirect or
          consequential loss arising from your use of the site, except where
          liability cannot be excluded under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Changes &amp; governing law">
        <p>
          We may update these terms from time to time; the current version
          always applies. These terms are governed by German law, without
          prejudice to mandatory consumer-protection rules of your country of
          residence.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
