import { getStays } from "@/lib/catalog";
import StaysView from "./StaysView";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export default async function StaysPage() {
  const stays = await getStays();
  return <StaysView stays={stays} />;
}
