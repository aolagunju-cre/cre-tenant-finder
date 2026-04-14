"use server";

import { searchAddress, type SearchResult } from "@/lib/server/search";
import { redirect } from "next/navigation";

export async function searchAddressAction(
  address: string
): Promise<SearchResult> {
  return searchAddress(address);
}
