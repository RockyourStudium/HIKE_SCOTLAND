import CatalogNav from "@/components/admin/CatalogNav";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CatalogNav />
      {children}
    </>
  );
}
