import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DrawerProvider, useDrawer } from "../drawer";

interface DrawerConsumerProps {
  content?: React.ReactNode;
  placement?: "bottom" | "top";
}

// Helper component
function DrawerConsumer({ content = "Drawer Content", placement = "bottom" }: DrawerConsumerProps) {
  const drawer = useDrawer();

  return (
    <>
      <button onClick={() => drawer.open({ content, placement })}>Open Drawer</button>
      <button onClick={() => drawer.close()}>Close Drawer</button>
    </>
  );
}

describe("DrawerProvider & useDrawer", () => {
  it("throws when useDrawer is used outside DrawerProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<DrawerConsumer />)).toThrow("useDrawer must be used inside DrawerProvider");
    consoleError.mockRestore();
  });

  it("renders children without showing drawer initially", () => {
    render(
      <DrawerProvider>
        <span>App Content</span>
      </DrawerProvider>
    );

    expect(screen.getByText("App Content")).toBeInTheDocument();
    expect(screen.queryByText("Drawer Content")).not.toBeInTheDocument();
  });

  it("opens drawer with correct content", () => {
    render(
      <DrawerProvider>
        <DrawerConsumer content="Hello Drawer" />
      </DrawerProvider>
    );

    fireEvent.click(screen.getByText("Open Drawer"));

    expect(screen.getByText("Hello Drawer")).toBeInTheDocument();
  });

  it("closes drawer when backdrop is clicked", async () => {
    render(
      <DrawerProvider>
        <DrawerConsumer content="Backdrop Test" />
      </DrawerProvider>
    );

    fireEvent.click(screen.getByText("Open Drawer"));
    expect(screen.getByText("Backdrop Test")).toBeInTheDocument();

    const overlay = document.querySelector("section.fixed");
    if (overlay) fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByText("Backdrop Test")).not.toBeInTheDocument();
    });
  });

  it("closes drawer when close() is called", async () => {
    render(
      <DrawerProvider>
        <DrawerConsumer content="Manual Close" />
      </DrawerProvider>
    );

    fireEvent.click(screen.getByText("Open Drawer"));
    expect(screen.getByText("Manual Close")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Drawer"));

    await waitFor(() => {
      expect(screen.queryByText("Manual Close")).not.toBeInTheDocument();
    });
  });

  it("uses bottom placement by default", () => {
    render(
      <DrawerProvider>
        <DrawerConsumer content="Bottom Drawer" />
      </DrawerProvider>
    );

    fireEvent.click(screen.getByText("Open Drawer"));

    const drawerElement = document.querySelector("div.fixed.left-0");
    expect(drawerElement?.className).toContain("bottom-0");
  });

  it("uses top placement when specified", () => {
    render(
      <DrawerProvider>
        <DrawerConsumer content="Top Drawer" placement="top" />
      </DrawerProvider>
    );

    fireEvent.click(screen.getByText("Open Drawer"));

    const drawerElement = document.querySelector("div.fixed.left-0");
    expect(drawerElement?.className).toContain("top-0");
  });
});
