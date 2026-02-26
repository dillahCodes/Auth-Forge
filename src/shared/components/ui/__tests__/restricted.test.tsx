import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Restricted } from "../restricted";

describe("Restricted", () => {
  it("renders children regardless of mode", () => {
    render(
      <Restricted mode="hidden">
        <span>Secret Content</span>
      </Restricted>
    );
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("applies blur class to children wrapper when mode is visible (restricted)", () => {
    const { container } = render(
      <Restricted mode="visible">
        <span>Blurred</span>
      </Restricted>
    );
    // The inner div wrapping children should have blur-sm class
    const blurredDiv = container.querySelector(".blur-sm");
    expect(blurredDiv).toBeInTheDocument();
  });

  it("does not apply blur class when mode is hidden (unrestricted)", () => {
    const { container } = render(
      <Restricted mode="hidden">
        <span>Clear</span>
      </Restricted>
    );
    expect(container.querySelector(".blur-sm")).not.toBeInTheDocument();
  });

  it("shows the warning message box when mode is visible", () => {
    render(
      <Restricted mode="visible" infoMessage="You need permission">
        <span>Content</span>
      </Restricted>
    );
    expect(screen.getByText("You need permission")).toBeInTheDocument();
  });

  it("forwards className to children wrapper div", () => {
    const { container } = render(
      <Restricted mode="hidden" className="my-custom-class">
        <span>Content</span>
      </Restricted>
    );
    expect(container.querySelector(".my-custom-class")).toBeInTheDocument();
  });
});
