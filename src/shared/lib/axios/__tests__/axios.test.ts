import { describe, it, expect } from "vitest";
import { axiosInstance, axiosRetryInstance } from "@/shared/lib/axios/axios";

describe("axiosInstance", () => {
  it("should have baseURL /", () => {
    expect(axiosInstance.defaults.baseURL).toBe("/");
  });

  it("should have Content-Type application/json", () => {
    expect(axiosInstance.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("should have a 30 second timeout", () => {
    expect(axiosInstance.defaults.timeout).toBe(30000);
  });

  it("should have withCredentials set to true", () => {
    expect(axiosInstance.defaults.withCredentials).toBe(true);
  });
});

describe("axiosRetryInstance", () => {
  it("should have baseURL /", () => {
    expect(axiosRetryInstance.defaults.baseURL).toBe("/");
  });

  it("should have Content-Type application/json", () => {
    expect(axiosRetryInstance.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("should have a 30 second timeout", () => {
    expect(axiosRetryInstance.defaults.timeout).toBe(30000);
  });

  it("should have withCredentials set to true", () => {
    expect(axiosRetryInstance.defaults.withCredentials).toBe(true);
  });
});
