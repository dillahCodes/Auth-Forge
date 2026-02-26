import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormHeader } from "../form-header";
import { FaUser } from "react-icons/fa";

describe("FormHeader", () => {
  it("renders the title", () => {
    render(<FormHeader title="Sign In" description="Enter your credentials" />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<FormHeader title="Sign In" description="Enter your credentials" />);
    expect(screen.getByText("Enter your credentials")).toBeInTheDocument();
  });

  it("renders the icon when icon prop is provided", () => {
    const { container } = render(
      <FormHeader title="Title" description="Desc" icon={FaUser} />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render an icon when icon prop is not provided", () => {
    const { container } = render(
      <FormHeader title="Title" description="Desc" />
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
