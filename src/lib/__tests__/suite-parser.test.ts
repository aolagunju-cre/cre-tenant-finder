import { describe, it, expect } from "@jest/globals";
import { parseSuite, extractFloor } from "@/lib/suite-parser";

describe("parseSuite", () => {
  it("parses Suite prefix", () => {
    expect(parseSuite("123 Main St, Suite 400, Calgary AB")).toEqual({
      suite: "400",
      floor: "400",
    });
  });

  it("parses Ste. abbreviation", () => {
    expect(parseSuite("123 Main St, Ste. 12, Calgary AB")).toEqual({
      suite: "12",
      floor: "12",
    });
  });

  it("parses Unit prefix", () => {
    expect(parseSuite("123 Main St, Unit 5A, Calgary AB")).toEqual({
      suite: "5A",
      floor: "5A",
    });
  });

  it("parses Floor prefix", () => {
    expect(parseSuite("123 Main St, Floor 3, Calgary AB")).toEqual({
      suite: "3",
      floor: "3",
    });
  });

  it("parses # prefix", () => {
    expect(parseSuite("123 Main St, #200, Calgary AB")).toEqual({
      suite: "200",
      floor: "200",
    });
  });

  it("returns null when no suite found", () => {
    expect(parseSuite("123 Main St, Calgary AB")).toBeNull();
  });
});

describe("extractFloor", () => {
  it("extracts numeric portion", () => {
    expect(extractFloor("400")).toBe(400);
    expect(extractFloor("12")).toBe(12);
    expect(extractFloor("3")).toBe(3);
    expect(extractFloor("200")).toBe(200);
  });

  it("extracts first numeric portion from mixed strings", () => {
    expect(extractFloor("5A")).toBe(5);
  });

  it("returns null for pure alpha strings", () => {
    expect(extractFloor("AB")).toBeNull();
  });

  it("returns first numeric match", () => {
    expect(extractFloor("Suite 400")).toBe(400);
  });
});
