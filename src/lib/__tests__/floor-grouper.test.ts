import { describe, it, expect } from "@jest/globals";
import { classifyIndustry, groupByFloor, deduplicateByAddress } from "@/lib/floor-grouper";

describe("classifyIndustry", () => {
  it("classifies food/restaurant", () => {
    expect(classifyIndustry(["restaurant"])).toBe("food");
    expect(classifyIndustry(["cafe"])).toBe("food");
    expect(classifyIndustry(["food"])).toBe("food");
    expect(classifyIndustry(["bakery"])).toBe("food");
  });

  it("classifies medical", () => {
    expect(classifyIndustry(["doctor"])).toBe("medical");
    expect(classifyIndustry(["hospital"])).toBe("medical");
    expect(classifyIndustry(["dentist"])).toBe("medical");
    expect(classifyIndustry(["pharmacy"])).toBe("medical");
  });

  it("classifies retail", () => {
    expect(classifyIndustry(["retail"])).toBe("retail");
    expect(classifyIndustry(["store"])).toBe("retail");
    expect(classifyIndustry(["shopping_mall"])).toBe("retail");
  });

  it("classifies office services", () => {
    expect(classifyIndustry(["lawyer"])).toBe("office");
    expect(classifyIndustry(["finance"])).toBe("office");
    expect(classifyIndustry(["insurance"])).toBe("office");
    expect(classifyIndustry(["real_estate"])).toBe("office");
    expect(classifyIndustry(["accountant"])).toBe("office");
  });

  it("returns unknown for unclassified", () => {
    expect(classifyIndustry(["something"])).toBe("unknown");
    expect(classifyIndustry([])).toBe("unknown");
  });
});

describe("groupByFloor", () => {
  it("groups by floor number", () => {
    const tenants = [
      { name: "A", suite: "400", floor: 4, phone: "", website: "", type: "office", business_status: "", formatted_address: "", place_id: "1" },
      { name: "B", suite: "401", floor: 4, phone: "", website: "", type: "office", business_status: "", formatted_address: "", place_id: "2" },
      { name: "C", suite: "200", floor: 2, phone: "", website: "", type: "retail", business_status: "", formatted_address: "", place_id: "3" },
    ];
    const groups = groupByFloor(tenants as Parameters<typeof groupByFloor>[0]);
    expect(groups).toHaveLength(2);
    expect(groups[0].floor).toBe(4);
    expect(groups[0].tenants).toHaveLength(2);
    expect(groups[1].floor).toBe(2);
  });

  it("sorts floors descending", () => {
    const tenants = [
      { name: "A", suite: "100", floor: 1, phone: "", website: "", type: "office", business_status: "", formatted_address: "", place_id: "1" },
      { name: "B", suite: "500", floor: 5, phone: "", website: "", type: "office", business_status: "", formatted_address: "", place_id: "2" },
      { name: "C", suite: "300", floor: 3, phone: "", website: "", type: "office", business_status: "", formatted_address: "", place_id: "3" },
    ];
    const groups = groupByFloor(tenants as Parameters<typeof groupByFloor>[0]);
    expect(groups[0].floor).toBe(5);
    expect(groups[1].floor).toBe(3);
    expect(groups[2].floor).toBe(1);
  });

  it("handles unknown floors", () => {
    const tenants = [
      { name: "A", suite: "", floor: null, phone: "", website: "", type: "office", business_status: "", formatted_address: "", place_id: "1" },
    ];
    const groups = groupByFloor(tenants as Parameters<typeof groupByFloor>[0]);
    expect(groups).toHaveLength(1);
    expect(groups[0].floor).toBe("unknown");
  });
});

describe("deduplicateByAddress", () => {
  it("removes exact duplicate entries by name and address", () => {
    const items = [
      { name: "Pizza Hut", formatted_address: "123 Main St" },
      { name: "Pizza Hut", formatted_address: "123 Main St" },
      { name: "Pizza Hut", formatted_address: "456 Oak Ave" },
      { name: "KFC", formatted_address: "123 Main St" },
    ];
    const result = deduplicateByAddress(items);
    // Keeps first occurrence of each unique name+address combo
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Pizza Hut");
    expect(result[0].formatted_address).toBe("123 Main St");
    expect(result[1].name).toBe("Pizza Hut");
    expect(result[1].formatted_address).toBe("456 Oak Ave");
    expect(result[2].name).toBe("KFC");
  });

  it("keeps all unique entries", () => {
    const items = [
      { name: "A", formatted_address: "1" },
      { name: "B", formatted_address: "2" },
      { name: "C", formatted_address: "3" },
    ];
    const result = deduplicateByAddress(items);
    expect(result).toHaveLength(3);
  });
});
