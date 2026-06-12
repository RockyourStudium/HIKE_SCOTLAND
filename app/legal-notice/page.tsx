import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Legal Notice",
  description:
    "Provider identification and legal information for Hike Scotland.",
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      eyebrow="Imprint"
      title="Legal Notice"
      intro="Provider identification in accordance with § 5 DDG (German Digital Services Act)."
    >
      <LegalSection title="Operator">
        <p>
          [Operator name]
          <br />
          [Street and number]
          <br />
          [Postal code and city]
          <br />
          [Country]
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Email: [contact@hike-scotland.example]
          <br />
          Phone: [optional]
        </p>
      </LegalSection>

      <LegalSection title="Responsible for content">
        <p>
          [Name of the person responsible for content under § 18(2) MStV],
          address as above.
        </p>
      </LegalSection>

      <LegalSection title="Liability for content">
        <p>
          The contents of this site are compiled with care. We assume no
          liability for the accuracy, completeness or timeliness of the content.
          As a service provider we are responsible for our own content under
          general law, but are not obliged to monitor third-party information
          transmitted or stored on this site.
        </p>
      </LegalSection>

      <LegalSection title="Liability for links">
        <p>
          Our site contains links to external websites over which we have no
          control. We accept no liability for their content; responsibility lies
          solely with the respective operators.
        </p>
      </LegalSection>

      <LegalSection title="Online dispute resolution">
        <p>
          The European Commission provides a platform for online dispute
          resolution at{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest-highland underline hover:text-forest-dark"
          >
            ec.europa.eu/consumers/odr
          </a>
          . We are neither obliged nor willing to participate in dispute
          resolution proceedings before a consumer arbitration board.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
