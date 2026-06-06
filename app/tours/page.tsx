import { getTours } from "@/lib/catalog";
import ToursView from "./ToursView";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export default async function ToursPage() {
  const tours = await getTours();
  return <ToursView tours={tours} />;
}
