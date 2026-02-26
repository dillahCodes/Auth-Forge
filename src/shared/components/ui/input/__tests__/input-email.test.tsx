import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputEmail } from "../input-email";

describe("InputEmail", () => {
  it("renders an input of type email", () => {
    render(<InputEmail />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("renders without visible error message by default", () => {
    render(<InputEmail />);
    // Activity renders the span with display:none when no error — check visibility, not presence
    const errorSpan = document.querySelector(".text-danger.text-sm");
    if (errorSpan) expect(errorSpan).not.toBeVisible();
  });

  it("renders the error message when errorMessage is provided", () => {
    render(<InputEmail errorMessage="Email is required" />);
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("applies danger border class when errorMessage is set", () => {
    const { container } = render(<InputEmail errorMessage="Invalid email" />);
    expect(container.querySelector(".border-danger")).toBeInTheDocument();
  });

  it("applies dark border class when no error", () => {
    const { container } = render(<InputEmail />);
    expect(container.querySelector(".border-dark")).toBeInTheDocument();
  });

  it("forwards inputProps to the input element", () => {
    render(<InputEmail inputProps={{ placeholder: "Enter email", "aria-label": "email" }} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Enter email");
  });

  it("forwards wrapperProps className to the section", () => {
    const { container } = render(<InputEmail wrapperProps={{ className: "wrapper-class" }} />);
    expect(container.querySelector("section")?.className).toContain("wrapper-class");
  });
});
