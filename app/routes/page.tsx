import { getRoutes } from "@/lib/catalog";
import RoutesView from "./RoutesView";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export default async function RoutesPage() {
  const routes = await getRoutes();
  return <RoutesView routes={routes} />;
}
