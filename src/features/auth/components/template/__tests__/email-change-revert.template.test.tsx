import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmailChangeRevertTemplate } from "../email-change-revert.template";

describe("EmailChangeRevertTemplate", () => {
  it("renders the 'Email Address Changed' heading", () => {
    render(
      <EmailChangeRevertTemplate
        name="Alice"
        url="https://example.com/revert"
        oldEmail="old@example.com"
        newEmail="new@example.com"
      />
    );
    expect(screen.getByText("Email Address Changed")).toBeInTheDocument();
  });

  it("renders the user name", () => {
    render(
      <EmailChangeRevertTemplate
        name="Alice"
        url="https://example.com/revert"
        oldEmail="old@example.com"
        newEmail="new@example.com"
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders the revert account link with correct href", () => {
    render(
      <EmailChangeRevertTemplate
        name="Bob"
        url="https://example.com/revert?token=xyz"
        oldEmail="old@example.com"
        newEmail="new@example.com"
      />
    );
    const link = screen.getByText("Revert Account").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/revert?token=xyz");
  });

  it("renders the link expiry text", () => {
    render(
      <EmailChangeRevertTemplate
        name="Alice"
        url="https://example.com"
        oldEmail="old@example.com"
        newEmail="new@example.com"
      />
    );
    expect(screen.getByText(/7 days/)).toBeInTheDocument();
  });

  it("renders footer copyright", () => {
    render(
      <EmailChangeRevertTemplate
        name="Alice"
        url="https://example.com"
        oldEmail="old@example.com"
        newEmail="new@example.com"
      />
    );
    expect(screen.getByText(/dillahcodes\.my\.id/i)).toBeInTheDocument();
  });
});
