import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { updateProfile, setNewsletter } from "./actions";

export const dynamic = "force-dynamic";

const FIELD =
  "w-full rounded-lg border border-mint/60 px-3 py-2 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland";
const LABEL = "block text-sm font-medium text-forest-dark";

const ERRORS: Record<string, string> = {
  email_invalid: "Please enter a valid email address.",
  email_taken: "That email address is already in use.",
  save: "Couldn’t save your changes. Please try again.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { saved?: string; err?: string; nl?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, phone, address")
    .eq("id", user.id)
    .single();

  // Abo-Status über service_role (subscribers ist nur dafür schreibbar; lesen
  // hier serverseitig statt über die enge read-own-Policy).
  const { data: sub } = await getSupabaseAdmin()
    .from("subscribers")
    .select("status")
    .eq("email", (user.email ?? "").toLowerCase())
    .maybeSingle();
  const subscribed = sub?.status === "subscribed";

  const saved = searchParams.saved === "1";
  const errMsg = searchParams.err ? ERRORS[searchParams.err] : null;
  const nlMsg =
    searchParams.nl === "on"
      ? "You’re subscribed to the newsletter."
      : searchParams.nl === "off"
        ? "You’ve unsubscribed from the newsletter."
        : null;

  return (
    <Container size="3xl" py="compact">
      <h1 className="font-display text-3xl font-bold text-forest-darkest">
        My Account
      </h1>
      <p className="mt-1 text-sm text-neutralgray">
        Manage your contact details. We use the contact email below for bookings
        and the newsletter.
      </p>

      {saved && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-mint/30 px-4 py-3 text-sm text-forest-dark">
          <CheckCircle2 aria-hidden className="h-4 w-4 text-forest-highland" />
          Changes saved.
        </div>
      )}
      {nlMsg && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-mint/30 px-4 py-3 text-sm text-forest-dark">
          <CheckCircle2 aria-hidden className="h-4 w-4 text-forest-highland" />
          {nlMsg}
        </div>
      )}
      {errMsg && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle aria-hidden className="h-4 w-4" />
          {errMsg}
        </div>
      )}

      <form action={updateProfile} className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-card">
        {/* Login email (read-only): comes from the Google account */}
        <div className="space-y-1.5">
          <span className={LABEL}>Login email (Google)</span>
          <input
            type="email"
            value={user.email ?? ""}
            disabled
            className={`${FIELD} cursor-not-allowed bg-fog/60 text-neutralgray`}
          />
          <p className="text-xs text-neutralgray">
            Managed through your Google account and can’t be changed here.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className={LABEL}>
            Name
          </label>
          <input id="name" name="name" type="text" defaultValue={profile?.name ?? ""} className={FIELD} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className={LABEL}>
            Contact email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={profile?.email ?? ""}
            placeholder="e.g. for booking confirmations"
            className={FIELD}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className={LABEL}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""} className={FIELD} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="address" className={LABEL}>
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            defaultValue={profile?.address ?? ""}
            className={FIELD}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit">Save changes</Button>
          <Link
            href="/account/bookings"
            className="text-sm font-medium text-forest-highland hover:underline"
          >
            My Bookings →
          </Link>
        </div>
      </form>

      {/* Newsletter-Abo verwalten */}
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Mail aria-hidden className="mt-0.5 h-5 w-5 text-mist" strokeWidth={2} />
            <div>
              <h2 className="font-display text-xl font-bold text-forest-darkest">
                Newsletter
              </h2>
              <p className="mt-1 max-w-md text-sm text-neutralgray">
                {subscribed
                  ? "You’re subscribed — new routes and seasonal highlights land in your inbox a few times a season."
                  : "New routes, guided tours and seasonal highlights — a few times a season."}
              </p>
              <p className="mt-2 text-xs text-neutralgray">
                Sent to {user.email}
              </p>
            </div>
          </div>
          <span
            className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
              subscribed
                ? "bg-fog text-forest-dark"
                : "bg-neutral-100 text-neutralgray"
            }`}
          >
            {subscribed ? "Subscribed" : "Not subscribed"}
          </span>
        </div>

        <form action={setNewsletter} className="mt-4">
          <input
            type="hidden"
            name="intent"
            value={subscribed ? "unsubscribe" : "subscribe"}
          />
          {subscribed ? (
            <Button type="submit" variant="outline">
              Unsubscribe
            </Button>
          ) : (
            <Button type="submit">Subscribe</Button>
          )}
        </form>
      </section>
    </Container>
  );
}
