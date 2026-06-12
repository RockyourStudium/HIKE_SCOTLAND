import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Hike Scotland collects, uses and protects your personal data — newsletter, bookings, accounts and privacy-friendly analytics.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your data"
      title="Privacy Policy"
      intro="We keep data collection to a minimum and explain plainly what we gather, why, and the rights you have over it."
      lastUpdated="12 June 2026"
    >
      <LegalSection title="Who we are">
        <p>
          Hike Scotland helps you discover and organise hiking routes, guided
          tours and places to stay across Scotland. This policy explains how we
          handle personal data when you use the site. Contact details for the
          operator are in our{" "}
          <Link href="/legal-notice" className="text-forest-highland underline hover:text-forest-dark">
            Legal Notice
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="What we collect and why">
        <p>We only collect data for specific, limited purposes:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Newsletter</strong> — your email address, so we can send the
            updates you signed up for. You can unsubscribe at any time via the
            link in every email.
          </li>
          <li>
            <strong>Bookings</strong> — your name, email, phone number and the
            details needed to fulfil a tour or stay reservation.
          </li>
          <li>
            <strong>Account &amp; sign-in</strong> — if you sign in with Google,
            we receive your name, email address and profile picture to create
            and secure your account.
          </li>
          <li>
            <strong>Analytics</strong> — aggregate, anonymous usage statistics
            (see “Tracking &amp; cookies” below).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Legal basis (GDPR)">
        <p>
          We process data on the basis of your consent (newsletter, analytics),
          the performance of a contract (bookings), and our legitimate interest
          in running a secure, functional website (essential account and
          session handling), in line with Art. 6(1) GDPR.
        </p>
      </LegalSection>

      <LegalSection title="Service providers">
        <p>
          We rely on a small set of processors, each handling data on our behalf
          under their own data-protection terms:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Supabase</strong> — database and authentication, hosted in
            the EU (Frankfurt, eu-central-1).
          </li>
          <li>
            <strong>Vercel</strong> — website hosting and content delivery.
          </li>
          <li>
            <strong>Umami Cloud</strong> — privacy-friendly, cookieless web
            analytics.
          </li>
          <li>
            <strong>Google</strong> — optional sign-in (OAuth).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Tracking &amp; cookies">
        <p>
          We use <strong>Umami</strong> for analytics. Umami is cookieless and
          does not track you across sites or build advertising profiles — it
          records only aggregate, anonymous metrics such as page views and
          referrers. We do not use advertising or third-party tracking cookies.
        </p>
        <p>
          The only cookies we set are strictly necessary ones required to keep
          you signed in and to secure your session when you use an account.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep your data">
        <p>
          We retain personal data only as long as needed for the purpose it was
          collected — newsletter data until you unsubscribe, booking data for as
          long as required to fulfil and document the reservation, and account
          data until you delete your account.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under the GDPR you have the right to access, rectify, erase, restrict
          and port your personal data, and to object to processing or withdraw
          consent at any time. To exercise any of these, contact us using the
          details in the{" "}
          <Link href="/legal-notice" className="text-forest-highland underline hover:text-forest-dark">
            Legal Notice
          </Link>
          . You may also lodge a complaint with your local data-protection
          authority.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
