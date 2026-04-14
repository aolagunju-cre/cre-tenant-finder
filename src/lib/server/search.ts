"use server";

import { PrismaClient } from "@prisma/client";
import { geocodeAddress } from "./geocode";
import {
  nearbySearch,
  getPlaceDetails,
  type PlaceResult,
} from "./places";
import { parseSuite, extractFloor } from "../suite-parser";
import { classifyIndustry, deduplicateByAddress } from "../floor-grouper";

const prisma = new PrismaClient();

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
}

export interface SearchResult {
  tenants: Tenant[];
  address: string;
  totalCount: number;
}

export async function searchAddress(
  address: string
): Promise<SearchResult> {
  // Step 1: Geocode
  const coords = await geocodeAddress(address);
  if (!coords) {
    return { tenants: [], address, totalCount: 0 };
  }

  // Step 2: Nearby search
  const places = await nearbySearch(coords.lat, coords.lng);
  if (!places.length) {
    return { tenants: [], address, totalCount: 0 };
  }

  // Step 3: Place Details with retry
  const detailed: PlaceResult[] = [];
  for (const place of places) {
    const details = await getPlaceDetails(place.place_id);
    detailed.push({ ...place, ...details } as PlaceResult);
  }

  // Step 4: Deduplicate
  const unique = deduplicateByAddress(detailed);

  // Step 5: Build tenant objects
  const tenants: Tenant[] = unique.map((p) => {
    const parsed = parseSuite(p.formatted_address);
    return {
      name: p.name,
      suite: parsed?.suite ?? "",
      floor: parsed ? extractFloor(parsed.suite) : null,
      phone: p.international_phone_number ?? "",
      website: p.website ?? "",
      type: classifyIndustry(p.types ?? []),
      business_status: p.business_status ?? "",
      formatted_address: p.formatted_address,
      place_id: p.place_id,
    };
  });

  // Step 6: Save to DB
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.search.create({
      data: {
        address,
        placeCount: tenants.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        results: tenants as any,
      },
    });
  } catch {
    // Non-fatal - search still works even if DB save fails
  }

  return { tenants, address, totalCount: tenants.length };
}

export async function getSearchHistory() {
  return prisma.search.findMany({
    orderBy: { createdAt: "desc" },
  });
}
