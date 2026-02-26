import { describe, it, expect } from "vitest";
import { censorEmail } from "@/shared/utils/censor-email";

describe("censorEmail", () => {
  it("should censor a normal email", () => {
    expect(censorEmail("john@example.com")).toBe("j.....n@example.com");
  });

  it("should censor a short local part", () => {
    // 'ab' → first='a', last='b'
    expect(censorEmail("ab@example.com")).toBe("a.....b@example.com");
  });

  it("should return the original email if there is no @ symbol", () => {
    expect(censorEmail("invalidemail")).toBe("invalidemail");
  });

  it("should return the original email if local part is missing", () => {
    expect(censorEmail("@domain.com")).toBe("@domain.com");
  });

  it("should handle a single-character local part", () => {
    expect(censorEmail("a@example.com")).toBe("a.....a@example.com");
  });
});
