import type { Tenant } from "@/lib/floor-grouper";

export function exportToCsv(tenants: Tenant[], filename = "tenants.csv") {
  const headers = ["Name", "Suite", "Floor", "Phone", "Website", "Type", "Address", "Business Status"];
  const rows = tenants.map((t) => [
    t.name,
    t.suite ?? "",
    t.floor?.toString() ?? "",
    t.phone ?? "",
    t.website ?? "",
    t.type,
    t.formatted_address,
    t.business_status ?? "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) =>
          `"${String(cell).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
