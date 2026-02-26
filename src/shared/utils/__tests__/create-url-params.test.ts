import { describe, it, expect } from "vitest";
import { createUrlParams } from "@/shared/utils/create-url-params";

describe("createUrlParams", () => {
  it("should return a query string starting with ?", () => {
    const result = createUrlParams({ key: "value" });
    expect(result).toMatch(/^\?/);
  });

  it("should include a single key-value pair", () => {
    const result = createUrlParams({ name: "john" });
    expect(result).toBe("?name=john");
  });

  it("should include multiple key-value pairs", () => {
    const result = createUrlParams({ a: "1", b: "2" });
    expect(result).toContain("a=1");
    expect(result).toContain("b=2");
  });

  it("should skip falsy (empty string) values", () => {
    const result = createUrlParams({ name: "john", empty: "" });
    expect(result).toContain("name=john");
    expect(result).not.toContain("empty");
  });

  it("should return just ? for an empty params object", () => {
    const result = createUrlParams({});
    expect(result).toBe("?");
  });
});
