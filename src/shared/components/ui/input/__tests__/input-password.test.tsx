import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputPassword } from "../input-password";

describe("InputPassword", () => {
  it("renders an input of type password by default", () => {
    render(<InputPassword />);
    // password inputs don't have an accessible role, query by type
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("shows 'Show' toggle button initially", () => {
    render(<InputPassword />);
    expect(screen.getByText("Show")).toBeInTheDocument();
  });

  it("switches input type to text when 'Show' is clicked", () => {
    render(<InputPassword />);
    fireEvent.click(screen.getByText("Show"));
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "text");
  });

  it("shows 'Hide' label after clicking Show", () => {
    render(<InputPassword />);
    fireEvent.click(screen.getByText("Show"));
    expect(screen.getByText("Hide")).toBeInTheDocument();
  });

  it("reverts to password type when 'Hide' is clicked", () => {
    render(<InputPassword />);
    fireEvent.click(screen.getByText("Show"));
    fireEvent.click(screen.getByText("Hide"));
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders error message when errorMessage is provided", () => {
    render(<InputPassword errorMessage="Password is required" />);
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("applies danger border when errorMessage is set", () => {
    const { container } = render(<InputPassword errorMessage="Required" />);
    expect(container.querySelector(".border-danger")).toBeInTheDocument();
  });

  it("forwards inputProps to the underlying input", () => {
    render(<InputPassword inputProps={{ name: "secret", "aria-label": "password-field" }} />);
    expect(document.querySelector("input")).toHaveAttribute("name", "secret");
  });
});
