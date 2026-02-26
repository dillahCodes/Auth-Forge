import { describe, it, expect } from "vitest";
import {
  ResourceUnprocessableEntity,
  TooManyRequests,
  ServiceUnavailable,
  NotFound,
  ResourceConflict,
  OperationNotAllowed,
} from "@/shared/errors/resource-error";
import { AppError } from "@/shared/errors/app-error";
import { ErrorCode, HttpStatusCode } from "@/shared/types/response";

describe("ResourceUnprocessableEntity", () => {
  it("should be an instance of AppError", () => {
    expect(new ResourceUnprocessableEntity()).toBeInstanceOf(AppError);
  });

  it("should have UNPROCESSABLE_ENTITY status", () => {
    expect(new ResourceUnprocessableEntity().status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
  });

  it("should use default message", () => {
    expect(new ResourceUnprocessableEntity().message).toBe("Unprocessable entity");
  });

  it("should accept custom message", () => {
    expect(new ResourceUnprocessableEntity("Custom").message).toBe("Custom");
  });
});

describe("TooManyRequests", () => {
  it("should have TOO_MANY_REQUESTS status", () => {
    expect(new TooManyRequests().status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
  });

  it("should have TOO_MANY_REQUESTS messageCode", () => {
    expect(new TooManyRequests().messageCode).toBe(ErrorCode.TOO_MANY_REQUESTS);
  });

  it("should use default message", () => {
    expect(new TooManyRequests().message).toBe("Too many requests");
  });
});

describe("ServiceUnavailable", () => {
  it("should have SERVICE_UNAVAILABLE status", () => {
    expect(new ServiceUnavailable().status).toBe(HttpStatusCode.SERVICE_UNAVAILABLE);
  });

  it("should have SERVICE_UNAVAILABLE messageCode", () => {
    expect(new ServiceUnavailable().messageCode).toBe(ErrorCode.SERVICE_UNAVAILABLE);
  });
});

describe("NotFound", () => {
  it("should have NOT_FOUND status", () => {
    expect(new NotFound().status).toBe(HttpStatusCode.NOT_FOUND);
  });

  it("should have RECOURCE_NOT_FOUND messageCode", () => {
    expect(new NotFound().messageCode).toBe(ErrorCode.RECOURCE_NOT_FOUND);
  });

  it("should use default message", () => {
    expect(new NotFound().message).toBe("Not found");
  });
});

describe("ResourceConflict", () => {
  it("should have CONFLICT status", () => {
    expect(new ResourceConflict().status).toBe(HttpStatusCode.CONFLICT);
  });

  it("should have CONFLICT messageCode", () => {
    expect(new ResourceConflict().messageCode).toBe(ErrorCode.CONFLICT);
  });
});

describe("OperationNotAllowed", () => {
  it("should have FORBIDDEN status", () => {
    expect(new OperationNotAllowed().status).toBe(HttpStatusCode.FORBIDDEN);
  });

  it("should have OPERATION_NOT_ALLOWED messageCode", () => {
    expect(new OperationNotAllowed().messageCode).toBe(ErrorCode.OPERATION_NOT_ALLOWED);
  });

  it("should accept custom errors record", () => {
    const errors = { field: ["reason"] };
    expect(new OperationNotAllowed("msg", errors).errors).toEqual(errors);
  });
});
