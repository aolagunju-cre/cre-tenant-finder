"use server";

const PLACES_V1_URL = "https://places.googleapis.com/v1/places:searchText";

export interface PlaceResult {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  primaryType?: string;
  types?: string[];
  businessStatus?: string;
  googleMapsUri?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
}

interface SearchResponse {
  places: PlaceResult[];
}

async function textSearch(
  apiKey: string,
  query: string,
  maxResults = 20
): Promise<PlaceResult[]> {
  const res = await fetch(PLACES_V1_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.primaryType",
        "places.types",
        "places.businessStatus",
        "places.googleMapsUri",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.internationalPhoneNumber",
      ].join(","),
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: maxResults,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 400) return [];
    throw new Error(`Places v1 API error: ${res.status}`);
  }

  const data: SearchResponse = await res.json();
  return data.places ?? [];
}

export async function searchTenants(
  address: string,
  postalCode: string
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  // Multiple search queries to catch different business listings at the address
  const searchQueries = [
    `businesses at ${address}`,
    `offices at ${address}`,
    `companies at ${address}`,
    `stores at ${address}`,
    `${address} tenants`,
    `${address} businesses`,
  ];

  const allResults: PlaceResult[] = [];

  for (const query of searchQueries) {
    try {
      const results = await textSearch(apiKey, query, 20);
      allResults.push(...results);
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    } catch {
      continue;
    }
  }

  // Deduplicate by place ID
  const seen = new Set<string>();
  const unique = allResults.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  // Filter to the target postal code
  if (postalCode) {
    return unique.filter((p) =>
      p.formattedAddress?.toLowerCase().includes(postalCode.toLowerCase())
    );
  }

  return unique;
}
