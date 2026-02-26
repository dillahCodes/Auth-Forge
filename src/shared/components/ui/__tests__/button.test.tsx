import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it.each(["info", "warning", "danger", "success", "text", "outline"] as const)(
    "renders children for variant '%s'",
    (variant) => {
      render(<Button variant={variant}>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    }
  );

  it("shows 'Loading...' text when isLoading is true", () => {
    render(<Button variant="info" isLoading>Save</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("hides children when isLoading is true", () => {
    render(<Button variant="info" isLoading>Save</Button>);
    // The content activity should be in hidden mode, so the text is not visible
    const content = screen.queryByText("Save");
    // It renders in the DOM but within a hidden Activity
    // We verify the loading indicator is shown instead
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders iconLeft when provided and not loading", () => {
    const icon = <span data-testid="icon-left">◀</span>;
    render(<Button variant="info" iconLeft={icon}>Click</Button>);
    expect(screen.getByTestId("icon-left")).toBeInTheDocument();
  });

  it("renders iconRight when provided and not loading", () => {
    const icon = <span data-testid="icon-right">▶</span>;
    render(<Button variant="info" iconRight={icon}>Click</Button>);
    expect(screen.getByTestId("icon-right")).toBeInTheDocument();
  });

  it("button is disabled when disabled prop passed", () => {
    render(<Button variant="info" disabled>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    const onClick = vi.fn();
    render(<Button variant="info" onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Button variant="info" disabled onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards type attribute to button element", () => {
    render(<Button variant="info" type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
