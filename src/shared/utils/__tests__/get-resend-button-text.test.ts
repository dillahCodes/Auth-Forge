import { describe, it, expect } from "vitest";
import { getResendButtonText } from "@/shared/utils/get-resend-button-text";

describe("getResendButtonText", () => {
  it("should return 'Sending...' when request is pending", () => {
    expect(getResendButtonText({ isReqPending: true, isCountdownDone: false, remaining: 30 })).toBe("Sending...");
  });

  it("should return 'Sending...' when pending even if countdown is done", () => {
    expect(getResendButtonText({ isReqPending: true, isCountdownDone: true, remaining: 0 })).toBe("Sending...");
  });

  it("should return countdown text when not pending and countdown is not done", () => {
    expect(getResendButtonText({ isReqPending: false, isCountdownDone: false, remaining: 15 })).toBe("Resend in 15s");
  });

  it("should return 'Resend Code' when countdown is done and not pending", () => {
    expect(getResendButtonText({ isReqPending: false, isCountdownDone: true, remaining: 0 })).toBe("Resend Code");
  });
});
