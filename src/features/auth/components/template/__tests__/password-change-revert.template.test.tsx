import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PasswordChangeRevertTemplate } from "../password-change-revert.template";

describe("PasswordChangeRevertTemplate", () => {
  it("renders the 'Password Changed' heading", () => {
    render(<PasswordChangeRevertTemplate name="Alice" url="https://example.com/revert" />);
    expect(screen.getByText("Password Changed")).toBeInTheDocument();
  });

  it("renders the user name", () => {
    render(<PasswordChangeRevertTemplate name="Alice" url="https://example.com/revert" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders the revert account link with correct href", () => {
    render(
      <PasswordChangeRevertTemplate name="Bob" url="https://example.com/revert?token=abc" />
    );
    const link = screen.getByText("Revert Account").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/revert?token=abc");
  });

  it("renders the link expiry notice", () => {
    render(<PasswordChangeRevertTemplate name="Alice" url="https://example.com" />);
    expect(screen.getByText(/7 days/)).toBeInTheDocument();
  });

  it("renders the ignore message for recognized activity", () => {
    render(<PasswordChangeRevertTemplate name="Alice" url="https://example.com" />);
    expect(screen.getByText(/safely ignore/i)).toBeInTheDocument();
  });

  it("renders footer copyright", () => {
    render(<PasswordChangeRevertTemplate name="Alice" url="https://example.com" />);
    expect(screen.getByText(/dillahcodes\.my\.id/i)).toBeInTheDocument();
  });
});
