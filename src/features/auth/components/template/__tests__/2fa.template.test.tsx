import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TwoFactorEmailTemplate } from "../2fa.template";

describe("TwoFactorEmailTemplate", () => {
  it("renders the 2-Step Verification heading", () => {
    render(<TwoFactorEmailTemplate otp="654321" />);
    expect(screen.getByText("2-Step Verification Code")).toBeInTheDocument();
  });

  it("renders the OTP code", () => {
    render(<TwoFactorEmailTemplate otp="654321" />);
    expect(screen.getByText("654321")).toBeInTheDocument();
  });

  it("renders user name when provided", () => {
    render(<TwoFactorEmailTemplate otp="000000" username="Bob" />);
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
  });

  it("renders generic greeting when username is not provided", () => {
    render(<TwoFactorEmailTemplate otp="000000" />);
    expect(screen.getByText(/Hello,/)).toBeInTheDocument();
  });

  it("renders the expiry information with default 15 minutes", () => {
    render(<TwoFactorEmailTemplate otp="123456" />);
    expect(screen.getByText(/15 minutes/)).toBeInTheDocument();
  });

  it("renders the location info", () => {
    render(<TwoFactorEmailTemplate otp="111111" location="Jakarta, ID" />);
    expect(screen.getByText(/Jakarta, ID/)).toBeInTheDocument();
  });

  it("renders default 'Unknown location' when location not provided", () => {
    render(<TwoFactorEmailTemplate otp="111111" />);
    expect(screen.getByText(/Unknown location/)).toBeInTheDocument();
  });

  it("renders the footer copyright", () => {
    render(<TwoFactorEmailTemplate otp="111111" />);
    expect(screen.getByText(/dillahcodes\.my\.id/i)).toBeInTheDocument();
  });
});
