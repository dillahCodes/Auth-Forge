import { describe, it, expect } from "vitest";
import { parseDevice } from "@/shared/utils/parse-device";

describe("parseDevice", () => {
  it("should return 'Unknown Device' for null userAgent", () => {
    expect(parseDevice(null)).toBe("Unknown Device");
  });

  it("should return 'Unknown Device' for undefined userAgent", () => {
    expect(parseDevice(undefined)).toBe("Unknown Device");
  });

  it("should return 'Unknown Device' for empty string", () => {
    expect(parseDevice("")).toBe("Unknown Device");
  });

  it("should detect a Windows desktop Chrome browser", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const result = parseDevice(ua);
    expect(result).toContain("Windows");
    expect(result).toContain("Chrome");
    expect(result).toContain("Desktop");
  });

  it("should detect a Mac OS / macOS Safari browser", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
    const result = parseDevice(ua);
    // ua-parser-js may report 'macOS' or 'Mac OS' depending on version; accept either
    expect(result).toMatch(/mac\s?os/i);
    expect(result).toContain("Safari");
  });

  it("should detect a mobile device", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36";
    const result = parseDevice(ua);
    expect(result).toContain("Android");
    expect(result).toContain("Chrome");
  });
});
