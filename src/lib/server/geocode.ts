"use server";

const GEO_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export interface GeocodeResult {
  lat: number;
  lng: number;
  formatted_address: string;
  postal_code: string;
}

export async function geocodeAddress(
  address: string
): Promise<GeocodeResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const res = await fetch(
    `${GEO_URL}?address=${encodeURIComponent(address)}&key=${apiKey}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    if (res.status === 400) return null;
    throw new Error(`Geocoding API error: ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== "OK" || !data.results?.length) {
    return null;
  }

  const result = data.results[0];
  const { lat, lng } = result.geometry.location;
  const formatted_address = result.formatted_address;

  // Extract Canadian postal code (A1A 1A1 pattern)
  const postal_code_match = formatted_address.match(
    /[A-Z]\d[A-Z]\s?\d[A-Z]\d/i
  );
  const postal_code = postal_code_match ? postal_code_match[0].replace(/\s/g, "") : "";

  return { lat, lng, formatted_address, postal_code };
}
