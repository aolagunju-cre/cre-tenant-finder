export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-2xl font-bold mt-8">CRE Tenant Finder</h1>
      <p className="text-muted-foreground mt-2">Search for tenants in a building</p>
    </main>
  );
}
