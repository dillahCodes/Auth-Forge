import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CurrentProvider } from "../current-provider";

describe("CurrentProvider", () => {
  it("renders the provider name in lowercase", () => {
    render(<CurrentProvider providerName="GOOGLE" />);
    expect(screen.getByText("google")).toBeInTheDocument();
  });

  it("renders 'Provider:' label always", () => {
    render(<CurrentProvider providerName="CREDENTIALS" />);
    expect(screen.getByText("Provider:")).toBeInTheDocument();
  });

  it("renders nothing for the name span when providerName is not provided", () => {
    render(<CurrentProvider />);
    const nameSpan = document.querySelectorAll("span")[1];
    expect(nameSpan?.textContent).toBe("");
  });

  it("forwards extra div props (e.g. data-testid)", () => {
    render(<CurrentProvider providerName="GOOGLE" data-testid="provider-badge" />);
    expect(screen.getByTestId("provider-badge")).toBeInTheDocument();
  });

  it("merges custom className with internal classes", () => {
    render(<CurrentProvider providerName="GOOGLE" className="custom-class" />);
    const div = screen.getByText("Provider:").closest("div");
    expect(div?.className).toContain("custom-class");
  });
});
