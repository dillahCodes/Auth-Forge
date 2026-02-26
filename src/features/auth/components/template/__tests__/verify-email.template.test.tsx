import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerifyEmailTemplate } from "../verify-email.template";

describe("VerifyEmailTemplate", () => {
  it("renders the email heading", () => {
    render(<VerifyEmailTemplate name="Alice" otp="123456" />);
    expect(screen.getByText("Verify Your Email")).toBeInTheDocument();
  });

  it("renders the user name", () => {
    render(<VerifyEmailTemplate name="Alice" otp="123456" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders the OTP code", () => {
    render(<VerifyEmailTemplate name="Alice" otp="123456" />);
    expect(screen.getByText("123456")).toBeInTheDocument();
  });

  it("renders the expiry notice", () => {
    render(<VerifyEmailTemplate name="Alice" otp="999000" />);
    expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
  });

  it("renders the footer copyright text", () => {
    render(<VerifyEmailTemplate name="Alice" otp="111222" />);
    expect(screen.getByText(/dillahcodes\.my\.id/i)).toBeInTheDocument();
  });
});
