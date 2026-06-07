"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";

/** Abmelden-Button (z.B. im Admin-Header). Nutzt den Auth-Kontext. */
export default function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useAuth();
  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full border border-mint/60 px-3 py-1.5 text-sm font-medium text-forest-highland transition-colors hover:bg-fog"
      }
    >
      <LogOut aria-hidden className="h-4 w-4" strokeWidth={2} />
      Sign out
    </button>
  );
}
