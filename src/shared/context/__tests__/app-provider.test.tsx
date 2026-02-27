import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppProvider } from "../app-provider";

// Mock all complex modal providers to avoid their internal hook/API dependencies
vi.mock("@/features/auth/components/modal/edit-email-verify.modal", () => ({
  VerifyChangeEmailModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/shared/components/ui/modal/modal", () => ({
  ModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/shared/components/ui/modal/modal-2fa", () => ({
  TwoFaModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/auth/hooks/auth-2fa/use-2fa-send", () => ({
  useTwoFaSend: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
    status: "idle",
    data: null,
    reset: vi.fn(),
  }),
}));

vi.mock("@/features/auth/hooks/auth-2fa/use-2fa-verify", () => ({
  useTwoFaVerify: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
    status: "idle",
    data: null,
    reset: vi.fn(),
  }),
}));

describe("AppProvider", () => {
  it("renders children", () => {
    render(
      <AppProvider>
        <span>App Child</span>
      </AppProvider>
    );
    expect(screen.getByText("App Child")).toBeInTheDocument();
  });

  it("composes all nested providers without throwing", () => {
    expect(() =>
      render(
        <AppProvider>
          <div>Nested Content</div>
        </AppProvider>
      )
    ).not.toThrow();
  });

  it("wraps children inside Suspense boundary", () => {
    render(
      <AppProvider>
        <span data-testid="suspense-child">Suspense Content</span>
      </AppProvider>
    );
    expect(screen.getByTestId("suspense-child")).toBeInTheDocument();
  });
});
