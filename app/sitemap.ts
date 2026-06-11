import type { MetadataRoute } from "next";
import { getRoutes, getStays, getTours } from "@/lib/catalog";
import { destinations } from "@/data/destinations";
import { siteUrl } from "@/lib/site";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, routes] = await Promise.all([getTours(), getRoutes()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/destinations`, priority: 0.9 },
    { url: `${siteUrl}/routes`, priority: 0.9 },
    { url: `${siteUrl}/tours`, priority: 0.9 },
    { url: `${siteUrl}/stays`, priority: 0.8 },
    { url: `${siteUrl}/plan`, priority: 0.8 },
    { url: `${siteUrl}/newsletter`, priority: 0.3 },
    { url: `${siteUrl}/credits`, priority: 0.1 },
  ];

  return [
    ...staticPages,
    ...destinations.map((d) => ({
      url: `${siteUrl}/destinations/${d.slug}`,
      priority: 0.8,
    })),
    ...routes.map((r) => ({
      url: `${siteUrl}/routes/${r.id}`,
      priority: 0.7,
    })),
    ...tours.map((t) => ({
      url: `${siteUrl}/tours/${t.id}`,
      priority: 0.7,
    })),
  ];
}
