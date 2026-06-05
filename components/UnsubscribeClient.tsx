"use client";

import { useState } from "react";
import { CheckCircle2, Mountain } from "lucide-react";

type State = "idle" | "loading" | "done" | "notfound" | "error";

export default function UnsubscribeClient({ token }: { token: string }) {
  const [state, setState] = useState<State>("idle");

  if (!token) {
    return (
      <p className="text-forest-dark">
        Dieser Abmelde-Link ist unvollständig. Bitte nutze den Link direkt aus
        der Newsletter-E-Mail.
      </p>
    );
  }

  async function handleUnsubscribe() {
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) setState("done");
      else if (res.status === 404) setState("notfound");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="text-center">
        <CheckCircle2
          aria-hidden
          className="mx-auto h-12 w-12 text-forest-highland"
          strokeWidth={1.75}
        />
        <h1 className="mt-4 font-display text-2xl text-forest-darkest">
          Du bist abgemeldet
        </h1>
        <p className="mx-auto mt-3 max-w-md text-forest-dark">
          Du erhältst keine Newsletter mehr. Schade, dass du gehst — du kannst
          dich jederzeit wieder anmelden.
        </p>
      </div>
    );
  }

  if (state === "notfound") {
    return (
      <p className="text-forest-dark">
        Dieser Abmelde-Link ist ungültig oder abgelaufen. Falls du weiterhin
        E-Mails erhältst, nutze bitte den Link aus einer aktuellen Newsletter-Mail.
      </p>
    );
  }

  return (
    <div className="text-center">
      <Mountain
        aria-hidden
        className="mx-auto h-10 w-10 text-forest-highland"
        strokeWidth={1.75}
      />
      <h1 className="mt-4 font-display text-2xl text-forest-darkest">
        Vom Newsletter abmelden?
      </h1>
      <p className="mx-auto mt-3 max-w-md text-forest-dark">
        Klicke unten, um dich abzumelden. Du erhältst dann keine weiteren
        E-Mails mehr.
      </p>
      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={state === "loading"}
        className="mt-6 rounded-xl bg-forest-highland px-6 py-3 font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
      >
        {state === "loading" ? "Wird abgemeldet …" : "Jetzt abmelden"}
      </button>
      {state === "error" && (
        <p className="mt-4 text-sm font-medium text-danger">
          Etwas ist schiefgelaufen. Bitte versuche es später erneut.
        </p>
      )}
    </div>
  );
}
