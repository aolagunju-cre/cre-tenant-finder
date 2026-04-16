import { AddressSearch } from "@/components/address-search";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">CRE Tenant Finder</h1>
          <p className="text-muted-foreground mt-2">Search for tenants in a building</p>
        </div>
        <div className="flex justify-center">
          <AddressSearch />
        </div>
      </div>
    </main>
  );
}
