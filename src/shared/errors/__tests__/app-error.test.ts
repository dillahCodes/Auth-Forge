import { describe, it, expect } from "vitest";
import { AppError } from "@/shared/errors/app-error";
import { ErrorCode, HttpStatusCode } from "@/shared/types/response";

describe("AppError", () => {
  it("should extend Error", () => {
    const err = new AppError("test", HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION_FAILED);
    expect(err).toBeInstanceOf(Error);
  });

  it("should set message correctly", () => {
    const err = new AppError("Something failed", HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION_FAILED);
    expect(err.message).toBe("Something failed");
  });

  it("should set status correctly", () => {
    const err = new AppError("msg", HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_UNAUTHORIZED);
    expect(err.status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should set messageCode correctly", () => {
    const err = new AppError("msg", HttpStatusCode.NOT_FOUND, ErrorCode.RECOURCE_NOT_FOUND);
    expect(err.messageCode).toBe(ErrorCode.RECOURCE_NOT_FOUND);
  });

  it("should set errors when provided", () => {
    const errors = { field: ["error1"] };
    const err = new AppError("msg", HttpStatusCode.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_FAILED, errors);
    expect(err.errors).toEqual(errors);
  });

  it("should leave errors undefined when not provided", () => {
    const err = new AppError("msg", HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION_FAILED);
    expect(err.errors).toBeUndefined();
  });

  it("should set name to the class name", () => {
    const err = new AppError("msg", HttpStatusCode.BAD_REQUEST, ErrorCode.VALIDATION_FAILED);
    expect(err.name).toBe("AppError");
  });
});
