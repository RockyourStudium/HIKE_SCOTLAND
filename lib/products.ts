import { getSupabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";

export type Product = Tables<"products">;

/** Alle Produkte, alphabetisch nach Name. */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}
