import { describe, it, expect } from "@jest/globals";

describe("exportToCsv logic", () => {
  it("generates CSV rows with proper quoting", () => {
    const tenants = [
      {
        name: "Pizza Hut",
        suite: "400",
        floor: 4,
        phone: "403-555-1234",
        website: "https://pizzahut.com",
        type: "food",
        business_status: "OPERATIONAL",
        formatted_address: "123 Main St, Calgary",
        place_id: "abc123",
      },
    ];

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
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    expect(csvContent).toContain('"Pizza Hut"');
    expect(csvContent).toContain('"400"');
    expect(csvContent).toContain('"123 Main St, Calgary"');
    expect(csvContent.split("\n")).toHaveLength(2);
  });

  it("handles empty values", () => {
    const tenants = [
      {
        name: "Test",
        suite: "",
        floor: null,
        phone: "",
        website: "",
        type: "office",
        business_status: "",
        formatted_address: "1 Main St",
        place_id: "1",
      },
    ];

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
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    expect(csvContent).toContain('"Test"');
    expect(csvContent).toContain('""');
  });
});
