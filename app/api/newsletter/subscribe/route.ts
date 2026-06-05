import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter-Anmeldung (ohne Double Opt-in: direkt 'subscribed').
 * Body: { email: string, firstName?: string, source?: string }
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const email = String(b.email ?? "").trim().toLowerCase();
  const firstName = b.firstName ? String(b.firstName).trim().slice(0, 100) : null;
  const source = b.source ? String(b.source).slice(0, 50) : null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  // Schon vorhanden? (z.B. früher abgemeldet → reaktivieren)
  const { data: existing, error: selErr } = await admin
    .from("subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (selErr) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  if (existing) {
    if (existing.status !== "subscribed") {
      const { error } = await admin
        .from("subscribers")
        .update({
          status: "subscribed",
          confirmed_at: nowIso,
          unsubscribed_at: null,
          ...(firstName ? { first_name: firstName } : {}),
        })
        .eq("id", existing.id);
      if (error) return NextResponse.json({ error: "db_error" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, already: true });
  }

  const { error: insErr } = await admin.from("subscribers").insert({
    email,
    first_name: firstName,
    status: "subscribed",
    confirmed_at: nowIso,
    source,
  });

  if (insErr) {
    // 23505 = unique violation (paralleler Insert) → als Erfolg behandeln
    if ((insErr as { code?: string }).code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
