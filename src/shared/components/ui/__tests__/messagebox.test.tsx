import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageBox } from "../messagebox";

describe("MessageBox", () => {
  it.each(["success", "error", "warning"] as const)(
    "renders children for type '%s'",
    (type) => {
      render(<MessageBox type={type}>Something went wrong</MessageBox>);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    }
  );

  it("applies success background class when type is success", () => {
    const { container } = render(<MessageBox type="success">OK</MessageBox>);
    expect(container.firstChild).toHaveClass("bg-success");
  });

  it("applies error background class when type is error", () => {
    const { container } = render(<MessageBox type="error">Error</MessageBox>);
    expect(container.firstChild).toHaveClass("bg-danger");
  });

  it("applies warning background class when type is warning", () => {
    const { container } = render(<MessageBox type="warning">Warn</MessageBox>);
    expect(container.firstChild).toHaveClass("bg-warning");
  });

  it("shows close button when onClose is provided", () => {
    render(<MessageBox type="error" onClose={() => {}}>Msg</MessageBox>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<MessageBox type="error" onClose={onClose}>Msg</MessageBox>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not show close button when onClose is not provided", () => {
    render(<MessageBox type="error">Msg</MessageBox>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
