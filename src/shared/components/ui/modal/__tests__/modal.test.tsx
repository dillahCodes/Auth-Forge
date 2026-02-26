import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalProvider, useModal } from "../modal";

// Helper component to consume useModal hook
function ModalConsumer({
  title = "Test Title",
  content = "Test content",
  onConfirm,
  onCancel,
  withConfirmButton = true,
  withCancelButton = true,
}: {
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  withConfirmButton?: boolean;
  withCancelButton?: boolean;
}) {
  const modal = useModal();
  return (
    <button
      onClick={() =>
        modal.open({ title, content, onConfirm, onCancel, withConfirmButton, withCancelButton })
      }
    >
      Open Modal
    </button>
  );
}

describe("ModalProvider & useModal", () => {
  it("throws when useModal is used outside ModalProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ModalConsumer />)).toThrow(
      "useModal must be used inside ModalProvider"
    );
    consoleError.mockRestore();
  });

  it("renders children without showing the modal initially", () => {
    render(
      <ModalProvider>
        <span>App Content</span>
      </ModalProvider>
    );
    expect(screen.getByText("App Content")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the modal with correct title and content when open() is called", () => {
    render(
      <ModalProvider>
        <ModalConsumer title="Confirm Delete" content="Are you sure?" />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("closes the modal when Cancel button is clicked", async () => {
    render(
      <ModalProvider>
        <ModalConsumer title="My Modal" />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("My Modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText("My Modal")).not.toBeInTheDocument();
    });
  });

  it("calls onConfirm callback when Confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    render(
      <ModalProvider>
        <ModalConsumer onConfirm={onConfirm} />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
  });

  it("calls onCancel callback when Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <ModalProvider>
        <ModalConsumer onCancel={onCancel} />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("hides Cancel button when withCancelButton=false", () => {
    render(
      <ModalProvider>
        <ModalConsumer withCancelButton={false} />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    // Activity hides with display:none — element is in DOM but not visible
    expect(screen.queryByText("Cancel")).not.toBeVisible();
  });

  it("hides Confirm button when withConfirmButton=false", () => {
    render(
      <ModalProvider>
        <ModalConsumer withConfirmButton={false} />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    // Activity hides with display:none — element is in DOM but not visible
    expect(screen.queryByText("Confirm")).not.toBeVisible();
  });

  it("closes the modal when the overlay backdrop is clicked", async () => {
    render(
      <ModalProvider>
        <ModalConsumer title="Backdrop Test" />
      </ModalProvider>
    );
    fireEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("Backdrop Test")).toBeInTheDocument();
    // Click the outer overlay section (first fixed section)
    const overlay = document.querySelector("section.fixed");
    if (overlay) fireEvent.click(overlay);
    await waitFor(() => {
      expect(screen.queryByText("Backdrop Test")).not.toBeInTheDocument();
    });
  });
});
