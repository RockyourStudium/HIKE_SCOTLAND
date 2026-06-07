"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, User as UserIcon, UserCircle, Backpack, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";

function displayName(meta: Record<string, unknown> | undefined, email?: string) {
  const full = (meta?.full_name ?? meta?.name) as string | undefined;
  return full || email || "Account";
}

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/**
 * Login/Logout-Steuerung für die Navigation. Ausgeloggt: „Anmelden" (Google).
 * Eingeloggt: Dropdown mit Konto, Buchungen, ggf. Admin und Abmelden.
 *
 * `mobile` rendert die Einträge flach (für das mobile Menü) statt als Dropdown.
 */
export default function UserMenu({ mobile = false }: { mobile?: boolean }) {
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // --- Ausgeloggt: Anmelden-Button ------------------------------------------
  if (!user) {
    return (
      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        className={`flex items-center gap-2 whitespace-nowrap rounded-full border border-fog/30 px-4 py-2 text-sm font-medium uppercase tracking-wide text-fog/90 transition-colors hover:bg-white/10 ${
          mobile ? "w-full justify-center" : ""
        }`}
      >
        <LogIn aria-hidden className="h-4 w-4" strokeWidth={2} />
        Sign in
      </button>
    );
  }

  const name = displayName(user.user_metadata, user.email ?? undefined);
  const avatarUrl = (user.user_metadata?.avatar_url ?? user.user_metadata?.picture) as
    | string
    | undefined;

  const Avatar = (
    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint text-xs font-bold text-forest-darkest">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initial(name)
      )}
    </span>
  );

  const items = (
    <>
      <Link
        href="/account"
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-fog"
      >
        <UserIcon aria-hidden className="h-4 w-4 text-mist" strokeWidth={2} />
        My Account
      </Link>
      <Link
        href="/account/profile"
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-fog"
      >
        <UserCircle aria-hidden className="h-4 w-4 text-mist" strokeWidth={2} />
        Public profile
      </Link>
      <Link
        href="/account/bookings"
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-fog"
      >
        <Backpack aria-hidden className="h-4 w-4 text-mist" strokeWidth={2} />
        My Bookings
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-fog"
        >
          <ShieldCheck aria-hidden className="h-4 w-4" strokeWidth={2} />
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={() => void signOut()}
        className="flex w-full items-center gap-2.5 border-t border-softgray/40 px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-fog"
      >
        <LogOut aria-hidden className="h-4 w-4" strokeWidth={2} />
        Sign out
      </button>
    </>
  );

  // --- Mobile: flache Liste --------------------------------------------------
  if (mobile) {
    return (
      <div className="rounded-lg border border-forest-highland/30">
        <div className="flex items-center gap-2.5 px-4 py-3 text-fog/90">
          {Avatar}
          <span className="truncate text-sm font-medium">{name}</span>
        </div>
        <div className="overflow-hidden rounded-b-lg bg-white text-forest-dark">
          {items}
        </div>
      </div>
    );
  }

  // --- Desktop: Dropdown -----------------------------------------------------
  return (
    <li ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 whitespace-nowrap rounded-full px-2 py-1.5 text-sm font-medium text-fog/90 transition-colors hover:bg-forest-highland/40"
      >
        {Avatar}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl bg-white text-forest-dark shadow-card-hover ring-1 ring-black/5">
          <div className="border-b border-softgray/40 px-4 py-3">
            <div className="truncate text-sm font-semibold text-forest-darkest">
              {name}
            </div>
            {user.email && (
              <div className="truncate text-xs text-neutralgray">{user.email}</div>
            )}
          </div>
          {items}
        </div>
      )}
    </li>
  );
}
