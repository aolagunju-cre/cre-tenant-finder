"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Search } from "lucide-react";
import { groupByFloor, type Tenant } from "@/lib/floor-grouper";
import { TenantCard } from "@/components/tenant-card";
import { TenantDetail } from "@/components/tenant-detail";
import { StackingPlan } from "@/components/stacking-plan";
import { exportToCsv } from "@/components/export-buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddressSearch } from "@/components/address-search";
import { searchAddressAction } from "./actions";

interface SearchData {
  address: string;
  count: number;
  tenants: Tenant[];
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const searchData = useMemo<SearchData | null>(() => {
    const data = searchParams.get("data");
    if (!data) return null;
    try {
      return JSON.parse(decodeURIComponent(data)) as SearchData;
    } catch {
      return null;
    }
  }, [searchParams]);

  const tenants = searchData?.tenants ?? [];
  const address = searchData?.address ?? "";
  const totalCount = searchData?.count ?? 0;

  const floors = groupByFloor(tenants);
  const hasSuites = tenants.some((t) => t.suite);

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleSearch = async (addr: string) => {
    setIsLoading(true);
    try {
      const result = await searchAddressAction(addr);
      const encoded = encodeURIComponent(
        JSON.stringify({
          address: result.address,
          count: result.totalCount,
          tenants: result.tenants,
        })
      );
      router.push(`/results?data=${encoded}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Results</h1>
        </div>
        {tenants.length > 0 && (
          <Button
            onClick={() => exportToCsv(tenants, `tenants-${Date.now()}.csv`)}
            variant="outline"
          >
            Export CSV
          </Button>
        )}
      </div>

      <AddressSearch onAddressSelect={handleSearch} isLoading={isLoading} />

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="h-4 w-4 animate-spin" />
          <span>Searching...</span>
        </div>
      )}

      {!isLoading && !searchData && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No search data.{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to search
          </Link>
        </div>
      )}

      {!isLoading && searchData && tenants.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No registered businesses found at this address
        </div>
      )}

      {!isLoading && tenants.length > 0 && (
        <>
          <div>
            <p className="text-sm text-muted-foreground">
              {totalCount} tenant{totalCount !== 1 ? "s" : ""} found at {address}
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant.place_id}
                tenant={tenant}
                onClick={() => {
                  setSelectedTenant(tenant);
                  setDetailOpen(true);
                }}
              />
            ))}
          </div>

          {/* Stacking Plan */}
          {hasSuites && (
            <StackingPlan
              floors={floors}
              onTenantClick={(t) => {
                setSelectedTenant(t);
                setDetailOpen(true);
              }}
            />
          )}
        </>
      )}

      <TenantDetail
        tenant={selectedTenant}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ResultsContent />
      </Suspense>
    </main>
  );
}
