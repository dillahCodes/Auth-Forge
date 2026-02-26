import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "../form";

describe("Form", () => {
  it("renders children", () => {
    render(<Form><span>Child</span></Form>);
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("applies border variant styles by default", () => {
    const { container } = render(<Form><span>Child</span></Form>);
    expect(container.querySelector("form")?.className).toContain("shadow-strong");
  });

  it("applies ghost variant styles when variant='ghost'", () => {
    const { container } = render(<Form variant="ghost"><span>Child</span></Form>);
    const form = container.querySelector("form");
    expect(form?.className).toContain("flex");
    expect(form?.className).not.toContain("shadow-strong");
  });

  it("calls onSubmit when the form is submitted", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );
    fireEvent.submit(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("merges custom className", () => {
    const { container } = render(<Form className="extra-class"><span>x</span></Form>);
    expect(container.querySelector("form")?.className).toContain("extra-class");
  });
});
