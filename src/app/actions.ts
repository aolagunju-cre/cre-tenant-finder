"use server";

import { redirect } from "next/navigation";
import { searchAddress } from "@/lib/server/search";

export async function doSearch(formData: FormData): Promise<void> {
  const address = formData.get("address") as string;
  if (!address?.trim()) return;

  const result = await searchAddress(address.trim());
  const encoded = encodeURIComponent(JSON.stringify({
    address: result.formatted_address || result.address,
    count: result.totalCount,
    tenants: result.tenants,
  }));
  redirect(`/results?data=${encoded}`);
}
