"use server";

const PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  international_phone_number?: string;
  website?: string;
  business_status?: string;
  types: string[];
  opening_hours?: Record<string, unknown>;
  geometry: { location: { lat: number; lng: number } };
}

async function fetchWithRetry(url: string, retries = 1): Promise<Response> {
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 429 && retries > 0) {
    await new Promise((r) => setTimeout(r, 1000));
    return fetchWithRetry(url, retries - 1);
  }
  return res;
}

export async function nearbySearch(
  lat: number,
  lng: number
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const url = `${PLACES_URL}?location=${lat},${lng}&radius=30&key=${apiKey}`;
  const res = await fetchWithRetry(url);

  if (!res.ok) {
    if (res.status === 400) return [];
    throw new Error(`Places API error: ${res.status}`);
  }

  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Places API status: ${data.status}`);
  }

  return (data.results ?? []) as PlaceResult[];
}

export async function getPlaceDetails(
  placeId: string
): Promise<Partial<PlaceResult>> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const url = `${DETAILS_URL}?place_id=${placeId}&fields=name,formatted_address,international_phone_number,website,business_status,types,opening_hours,geometry&key=${apiKey}`;
  const res = await fetchWithRetry(url);

  if (!res.ok) return {};

  const data = await res.json();
  if (data.status !== "OK") return {};

  return data.result as Partial<PlaceResult>;
}
