import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordResetVerifyTemplate } from "../password-reset-verify.template";

describe("PasswordResetVerifyTemplate", () => {
  it("renders the 'Reset Your Password' heading", () => {
    render(<PasswordResetVerifyTemplate name="Alice" url="https://example.com/reset" />);
    expect(screen.getByText("Reset Your Password")).toBeInTheDocument();
  });

  it("renders the user name", () => {
    render(<PasswordResetVerifyTemplate name="Alice" url="https://example.com/reset" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders the reset password link with correct href", () => {
    render(<PasswordResetVerifyTemplate name="Bob" url="https://example.com/reset?token=abc" />);
    const link = screen.getByText("Reset Password").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/reset?token=abc");
  });

  it("renders expiry warning", () => {
    render(<PasswordResetVerifyTemplate name="Alice" url="https://example.com" />);
    expect(screen.getByText(/15 minutes/)).toBeInTheDocument();
  });

  it("renders the safety ignore message", () => {
    render(<PasswordResetVerifyTemplate name="Alice" url="https://example.com" />);
    expect(screen.getByText(/safely ignore/i)).toBeInTheDocument();
  });

  it("renders footer copyright", () => {
    render(<PasswordResetVerifyTemplate name="Alice" url="https://example.com" />);
    expect(screen.getByText(/dillahcodes\.my\.id/i)).toBeInTheDocument();
  });
});
