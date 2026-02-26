import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputText } from "../input-text";
import { FaSearch } from "react-icons/fa";

describe("InputText", () => {
  it("renders an input of type text by default", () => {
    render(<InputText />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("respects inputProps.type override", () => {
    render(<InputText inputProps={{ type: "number", "aria-label": "number-input" }} />);
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "number");
  });

  it("renders error message when errorMessage is provided", () => {
    render(<InputText errorMessage="Field is required" />);
    expect(screen.getByText("Field is required")).toBeInTheDocument();
  });

  it("does not render error message when errorMessage is absent", () => {
    render(<InputText />);
    expect(document.querySelector(".text-danger")).not.toBeInTheDocument();
  });

  it("applies danger border class when errorMessage is set", () => {
    const { container } = render(<InputText errorMessage="Error" />);
    expect(container.querySelector(".border-danger")).toBeInTheDocument();
  });

  it("renders labelIcon when provided", () => {
    const { container } = render(<InputText labelIcon={FaSearch} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render icon when labelIcon is not provided", () => {
    const { container } = render(<InputText />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("forwards inputProps to the input element", () => {
    render(<InputText inputProps={{ placeholder: "Search...", name: "search" }} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Search...");
  });
});
