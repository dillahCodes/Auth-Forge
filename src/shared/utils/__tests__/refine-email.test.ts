import { describe, it, expect } from "vitest";
import { refineEmailDomain, refineEmailHumanLike } from "@/shared/utils/refine-email";

describe("refineEmailDomain", () => {
  it("should return true for a gmail.com email", () => {
    expect(refineEmailDomain("user@gmail.com")).toBe(true);
  });

  it("should return false for an unknown domain", () => {
    expect(refineEmailDomain("user@notadomain.example")).toBe(false);
  });

  it("should return false for an email with no @", () => {
    // domain will be undefined, not in allowed list
    expect(refineEmailDomain("nodomain")).toBe(false);
  });
});

describe("refineEmailHumanLike", () => {
  it("should return true for a normal email local part", () => {
    expect(refineEmailHumanLike("johndoe@gmail.com")).toBe(true);
  });

  it("should return false if local part is shorter than 3 chars", () => {
    expect(refineEmailHumanLike("ab@gmail.com")).toBe(false);
  });

  it("should return false if local part is longer than 40 chars", () => {
    expect(refineEmailHumanLike("a".repeat(41) + "@gmail.com")).toBe(false);
  });

  it("should return false if local has no letters", () => {
    expect(refineEmailHumanLike("123@gmail.com")).toBe(false);
  });

  it("should return false if local has invalid characters", () => {
    expect(refineEmailHumanLike("user name@gmail.com")).toBe(false);
  });

  it("should return false if local has too many repeating characters (5+)", () => {
    expect(refineEmailHumanLike("aaaaa@gmail.com")).toBe(false);
  });

  it("should return false if local has too many dots (4+)", () => {
    expect(refineEmailHumanLike("a.b.c.d.e@gmail.com")).toBe(false);
  });

  it("should return false if local part is missing", () => {
    expect(refineEmailHumanLike("@gmail.com")).toBe(false);
  });
});
