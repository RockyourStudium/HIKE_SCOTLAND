"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Client-Auth-Kontext. Hydratisiert die Session client-seitig (analog zu Trip-/
 * Catalog-Provider), damit die statischen Marketing-Seiten nicht ins dynamische
 * Rendering gezwungen werden. Server-seitig bleibt der Schutz in Middleware +
 * Admin-Layout maßgeblich; die Admin-Sichtbarkeit hier ist reine UX.
 *
 * Bei echtem Login/Logout (User-Wechsel) wird router.refresh() ausgelöst, damit
 * server-gerenderte, geschützte Seiten neu laden.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const lastUserId = useRef<string | null>(null);
  const initialised = useRef(false);

  useEffect(() => {
    let active = true;

    const fetchRole = async (u: User | null) => {
      if (!u) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single();
      if (active) setIsAdmin(data?.role === "admin");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      const nextId = nextUser?.id ?? null;
      setUser(nextUser);
      void fetchRole(nextUser);
      // Beim ersten Event (INITIAL_SESSION) nicht refreshen; nur bei echtem
      // späteren Login/Logout server-State neu laden.
      if (initialised.current && nextId !== lastUserId.current) {
        router.refresh();
      }
      lastUserId.current = nextId;
      initialised.current = true;
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signInWithGoogle = async () => {
    const next = pathname || "/";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        // Konto-Auswahl erzwingen, sonst meldet Google bei aktiver SSO-Session
        // still wieder an (es wirkt, als hätte der Logout nichts bewirkt).
        queryParams: { prompt: "select_account" },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const value = useMemo<AuthContextValue>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => ({ user, isAdmin, signInWithGoogle, signOut }),
    [user, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
