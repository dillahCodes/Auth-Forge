import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import QueryProvider from "../query-client-provider";

// Consumer that uses react-query to verify provider is wired correctly
function QueryConsumer() {
  const { status } = useQuery({ queryKey: ["test"], queryFn: () => Promise.resolve("ok") });
  return <span data-testid="status">{status}</span>;
}

describe("QueryProvider", () => {
  it("renders children", () => {
    render(
      <QueryProvider>
        <span>Child Content</span>
      </QueryProvider>
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("provides QueryClient context so useQuery does not throw", () => {
    render(
      <QueryProvider>
        <QueryConsumer />
      </QueryProvider>
    );
    // If QueryClient is not provided, useQuery throws. If it renders, provider works.
    expect(screen.getByTestId("status")).toBeInTheDocument();
  });

  it("throws when useQuery is used without QueryProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<QueryConsumer />)).toThrow();
    consoleError.mockRestore();
  });
});
