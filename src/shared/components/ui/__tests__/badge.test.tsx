import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../badge";

describe("StatusBadge", () => {
  it("renders 'Verified' label by default when status is verified", () => {
    render(<StatusBadge status="verified" />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("renders 'Pending' label by default when status is pending", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders custom children instead of default label", () => {
    render(<StatusBadge status="verified">Active</StatusBadge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });

  it("applies verified styles when status is verified", () => {
    render(<StatusBadge status="verified" />);
    const badge = screen.getByText("Verified").closest("span");
    expect(badge?.className).toContain("bg-success");
  });

  it("applies pending styles when status is pending", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Pending").closest("span");
    expect(badge?.className).toContain("bg-warning");
  });

  it("forwards extra HTML attributes to the span", () => {
    render(<StatusBadge status="verified" data-testid="badge" />);
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("merges custom className with internal styles", () => {
    render(<StatusBadge status="verified" className="custom-class" />);
    const badge = screen.getByText("Verified").closest("span");
    expect(badge?.className).toContain("custom-class");
  });
});
