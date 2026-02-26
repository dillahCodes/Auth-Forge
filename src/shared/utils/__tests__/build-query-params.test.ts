import { describe, it, expect } from "vitest";
import { buildQueryParams } from "@/shared/utils/build-query-params";

describe("buildQueryParams", () => {
  it("should build a query string from defined values", () => {
    const result = buildQueryParams({ foo: "bar", baz: "qux" });
    expect(result).toContain("foo=bar");
    expect(result).toContain("baz=qux");
  });

  it("should skip undefined values", () => {
    const result = buildQueryParams({ foo: "bar", baz: undefined });
    expect(result).toContain("foo=bar");
    expect(result).not.toContain("baz");
  });

  it("should return an empty string for an empty object", () => {
    const result = buildQueryParams({});
    expect(result).toBe("");
  });

  it("should return an empty string if all values are undefined", () => {
    const result = buildQueryParams({ foo: undefined, bar: undefined });
    expect(result).toBe("");
  });
});
