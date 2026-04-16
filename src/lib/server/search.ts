"use server";

import { geocodeAddress, type GeocodeResult } from "./geocode";
import { searchTenants, type PlaceResult } from "./places";
import { parseSuite, extractFloor } from "../suite-parser";
import { classifyIndustry } from "../floor-grouper";

export interface Tenant {
  name: string;
  suite: string;
  floor: number | null;
  phone: string;
  website: string;
  type: string;
  business_status: string;
  formatted_address: string;
  place_id: string;
  maps_url: string;
}

export interface SearchResult {
  tenants: Tenant[];
  address: string;
  formatted_address: string;
  totalCount: number;
}

// In-memory search history (resets on cold start — fine for MVP)
const searchHistory: Array<{
  address: string;
  placeCount: number;
  createdAt: Date;
}> = [];

export async function searchAddress(
  address: string
): Promise<SearchResult> {
  // Step 1: Geocode — get coords, formatted address, and postal code
  const geo: GeocodeResult | null = await geocodeAddress(address);
  if (!geo) {
    return { tenants: [], address, formatted_address: "", totalCount: 0 };
  }

  // Step 2: Multi-query text search via Places v1 API
  const rawPlaces: PlaceResult[] = await searchTenants(
    geo.formatted_address,
    geo.postal_code
  );

  if (!rawPlaces.length) {
    return { tenants: [], address, formatted_address: geo.formatted_address, totalCount: 0 };
  }

  // Step 3: Build tenant objects
  const tenants: Tenant[] = rawPlaces.map((p) => {
    const parsed = parseSuite(p.formattedAddress ?? "");
    return {
      name: p.displayName?.text ?? "",
      suite: parsed?.suite ?? "",
      floor: parsed ? extractFloor(parsed.suite) : null,
      phone: p.nationalPhoneNumber ?? p.internationalPhoneNumber ?? "",
      website: p.websiteUri ?? "",
      type: classifyIndustry(p.types ?? []),
      business_status: p.businessStatus ?? "",
      formatted_address: p.formattedAddress ?? "",
      place_id: p.id,
      maps_url: p.googleMapsUri ?? "",
    };
  });

  // Save to in-memory history
  searchHistory.push({
    address: geo.formatted_address,
    placeCount: tenants.length,
    createdAt: new Date(),
  });

  return {
    tenants,
    address,
    formatted_address: geo.formatted_address,
    totalCount: tenants.length,
  };
}

export async function getSearchHistory() {
  return searchHistory;
}
