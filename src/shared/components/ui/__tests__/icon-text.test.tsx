import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IconWithText } from "../icon-text";
import { FaUser } from "react-icons/fa";

describe("IconWithText", () => {
  it("renders the text prop", () => {
    render(<IconWithText icon={FaUser} text="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders nothing for text when text is not provided", () => {
    render(<IconWithText icon={FaUser} />);
    // A <p> is still rendered but empty
    const p = document.querySelector("p");
    expect(p?.textContent).toBe("");
  });

  it("renders the icon svg element", () => {
    const { container } = render(<IconWithText icon={FaUser} text="User" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("forwards wrapperProps className", () => {
    render(<IconWithText icon={FaUser} text="User" wrapperProps={{ className: "my-class" }} />);
    const wrapper = screen.getByText("User").closest("div");
    expect(wrapper?.className).toContain("my-class");
  });

  it("forwards textProps to the paragraph element", () => {
    render(
      <IconWithText
        icon={FaUser}
        text="User"
        textProps={{ "data-testid": "text-el" } as React.HTMLAttributes<HTMLParagraphElement>}
      />
    );
    expect(screen.getByTestId("text-el")).toBeInTheDocument();
  });
});
