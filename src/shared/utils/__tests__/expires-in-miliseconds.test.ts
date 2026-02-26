import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { expiresInMiliseconds } from "@/shared/utils/expires-in-miliseconds";

describe("expiresInMiliseconds", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a Date in the future by the given seconds", () => {
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    const result = expiresInMiliseconds(60);
    const expected = new Date("2024-01-01T00:01:00.000Z");
    expect(result).toEqual(expected);
  });

  it("should return a Date 1 second in the future for 1 second", () => {
    vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
    const result = expiresInMiliseconds(1);
    const expected = new Date("2024-06-15T12:00:01.000Z");
    expect(result).toEqual(expected);
  });

  it("should return a Date instance", () => {
    const result = expiresInMiliseconds(100);
    expect(result).toBeInstanceOf(Date);
  });

  it("should handle zero seconds (now)", () => {
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    const result = expiresInMiliseconds(0);
    expect(result).toEqual(new Date("2024-01-01T00:00:00.000Z"));
  });
});
