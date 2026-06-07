"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Eyebrow from "@/components/Eyebrow";
import NewsletterForm from "@/components/NewsletterForm";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";

/**
 * Compact newsletter section shown above the footer. Skipped where it doesn't
 * make sense:
 *  - /newsletter      (the page already leads with the full form)
 *  - /account*        (the account page has its own subscription control)
 *  - admins           (they manage the site, not a sign-up target)
 *  - already-subscribed, signed-in users (no need to nag)
 */
export default function NewsletterBand() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  // "unknown" until we've checked the signed-in user's subscription.
  const [sub, setSub] = useState<"unknown" | "subscribed" | "none">("unknown");

  useEffect(() => {
    if (!user) {
      setSub("none");
      return;
    }
    let active = true;
    setSub("unknown");
    const supabase = createClient();
    supabase
      .from("subscribers")
      .select("status")
      .eq("email", (user.email ?? "").toLowerCase())
      .maybeSingle()
      .then(({ data }) => {
        if (active) setSub(data?.status === "subscribed" ? "subscribed" : "none");
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (pathname === "/newsletter") return null;
  if (pathname?.startsWith("/account")) return null;
  if (isAdmin) return null;
  // Signed-in: hide until we know the status, and hide if already subscribed.
  if (user && sub !== "none") return null;

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
          <Eyebrow tone="mint" dash>News from the trail</Eyebrow>
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
