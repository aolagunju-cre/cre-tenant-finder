"use server";

const GEO_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
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

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}
