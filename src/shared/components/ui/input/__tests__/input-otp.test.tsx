import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { InputOtp } from "../input-otp";

function buildProps(overrides = {}) {
  return {
    handleOtpInputChange: vi.fn(),
    handleKeyDown: vi.fn(),
    handlePaste: vi.fn(),
    // Use a plain mutable ref object — createRef() sets current=null which breaks
    // the component's `inputsRef.current[index] = el!` assignment
    inputsRef: { current: [] } as unknown as React.RefObject<HTMLInputElement[]>,
    otpLength: 6,
    ...overrides,
  };
}

describe("InputOtp", () => {
  it("renders the correct number of input boxes", () => {
    const { container } = render(<InputOtp {...buildProps()} />);
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(6);
  });

  it("renders custom otpLength inputs", () => {
    const { container } = render(<InputOtp {...buildProps({ otpLength: 4 })} />);
    expect(container.querySelectorAll("input")).toHaveLength(4);
  });

  it("each input has maxLength=1", () => {
    const { container } = render(<InputOtp {...buildProps()} />);
    container.querySelectorAll("input").forEach((input) => {
      expect(input).toHaveAttribute("maxLength", "1");
    });
  });

  it("each input has type='text'", () => {
    const { container } = render(<InputOtp {...buildProps()} />);
    container.querySelectorAll("input").forEach((input) => {
      expect(input).toHaveAttribute("type", "text");
    });
  });

  it("each input has inputMode='numeric'", () => {
    const { container } = render(<InputOtp {...buildProps()} />);
    container.querySelectorAll("input").forEach((input) => {
      expect(input).toHaveAttribute("inputmode", "numeric");
    });
  });

  it("calls handleOtpInputChange when an input changes", () => {
    const handleOtpInputChange = vi.fn();
    const { container } = render(<InputOtp {...buildProps({ handleOtpInputChange })} />);
    const firstInput = container.querySelectorAll("input")[0];
    fireEvent.change(firstInput, { target: { value: "5" } });
    expect(handleOtpInputChange).toHaveBeenCalledWith(expect.any(Object), 0);
  });

  it("calls handleKeyDown when a key is pressed", () => {
    const handleKeyDown = vi.fn();
    const { container } = render(<InputOtp {...buildProps({ handleKeyDown })} />);
    const firstInput = container.querySelectorAll("input")[0];
    fireEvent.keyDown(firstInput, { key: "Backspace" });
    expect(handleKeyDown).toHaveBeenCalledWith(expect.any(Object), 0);
  });

  it("calls handlePaste when paste event fires on an input", () => {
    const handlePaste = vi.fn();
    const { container } = render(<InputOtp {...buildProps({ handlePaste })} />);
    const firstInput = container.querySelectorAll("input")[0];
    fireEvent.paste(firstInput);
    expect(handlePaste).toHaveBeenCalledOnce();
  });
});
