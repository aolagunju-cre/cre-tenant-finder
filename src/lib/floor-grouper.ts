import { extractFloor } from "./suite-parser";

export function deduplicateByAddress<T extends { name: string; formatted_address: string }>(
  items: T[]
): T[] {
  const seen = new Set<string>();
  return items.filter((p) => {
    const key = `${p.name}::${p.formatted_address}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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

export interface FloorGroup {
  floor: number | string;
  tenants: Tenant[];
  label: string;
}

export const INDUSTRY_COLORS: Record<string, string> = {
  office: "bg-blue-100 text-blue-800 border-blue-200",
  retail: "bg-amber-100 text-amber-800 border-amber-200",
  medical: "bg-teal-100 text-teal-800 border-teal-200",
  food: "bg-orange-100 text-orange-800 border-orange-200",
  unknown: "bg-gray-100 text-gray-800 border-gray-200",
};

export function classifyIndustry(types: string[]): string {
  const typeStr = types.join(" ").toLowerCase();

  if (
    typeStr.includes("restaurant") ||
    typeStr.includes("food") ||
    typeStr.includes("cafe") ||
    typeStr.includes("bakery") ||
    typeStr.includes("meal delivery")
  ) {
    return "food";
  }

  if (
    typeStr.includes("doctor") ||
    typeStr.includes("medical") ||
    typeStr.includes("hospital") ||
    typeStr.includes("clinic") ||
    typeStr.includes("dentist") ||
    typeStr.includes("pharmacy") ||
    typeStr.includes("health")
  ) {
    return "medical";
  }

  if (
    typeStr.includes("retail") ||
    typeStr.includes("store") ||
    typeStr.includes("shop") ||
    typeStr.includes("mall")
  ) {
    return "retail";
  }

  if (
    typeStr.includes("lawyer") ||
    typeStr.includes("finance") ||
    typeStr.includes("insurance") ||
    typeStr.includes("real estate") ||
    typeStr.includes("real_estate") ||
    typeStr.includes("accountant") ||
    typeStr.includes("bank")
  ) {
    return "office";
  }

  return "unknown";
}

export function groupByFloor(tenants: Tenant[]): FloorGroup[] {
  const groups: Map<string | number, Tenant[]> = new Map();

  for (const tenant of tenants) {
    const key = tenant.floor ?? "unknown";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(tenant);
  }

  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    if (typeof a === "number" && typeof b === "number") return b - a;
    if (typeof a === "number") return -1;
    if (typeof b === "number") return 1;
    return String(a).localeCompare(String(b));
  });

  return sortedKeys.map((key) => ({
    floor: key,
    label: key === "unknown" ? "Unknown Floor" : `Floor ${key}`,
    tenants: groups.get(key)!,
  }));
}
