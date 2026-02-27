import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TwoFaModalProvider, useTwoFaModal } from "../modal-2fa";

// Mock all external hooks the 2FA modal depends on
vi.mock("@/features/auth/hooks/auth-2fa/use-2fa-send", () => ({
  useTwoFaSend: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
    status: "idle",
    data: null,
    reset: vi.fn(),
  }),
}));

vi.mock("@/features/auth/hooks/auth-2fa/use-2fa-verify", () => ({
  useTwoFaVerify: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
    status: "idle",
    data: null,
    reset: vi.fn(),
  }),
}));

vi.mock("@/features/auth/hooks/use-otp", () => ({
  useOtp: () => ({
    otpLength: 6,
    handleOtpInputChange: vi.fn(),
    handleKeyDown: vi.fn(),
    handlePaste: vi.fn(),
    inputsRef: { current: [] },
  }),
}));

vi.mock("@/shared/hooks/use-countdown", () => ({
  useCountdown: () => ({
    startCountdown: vi.fn(),
    internalState: { isCountdownDone: true, remaining: 0 },
  }),
  getCountdownRemaining: () => ({ isCountdownDone: true, remaining: 0 }),
}));

vi.mock("@/shared/hooks/use-build-axios-erros", () => ({
  useBuildAxiosError: () => null,
}));

// Helper wrapper with QueryClient for react-query
function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

// Consumer component to test the hook
function TwoFaConsumer() {
  const modal = useTwoFaModal();
  return (
    <button
      onClick={() =>
        modal.open({
          config: { featureKey: "test", timeoutSeconds: 60, otpLength: 6 },
          sendToEmail: "user@test.com",
          scope: "CHANGE_EMAIL",
        })
      }
    >
      Open 2FA
    </button>
  );
}

describe("TwoFaModalProvider & useTwoFaModal", () => {
  const Wrapper = createWrapper();

  it("throws when useTwoFaModal is used outside TwoFaModalProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Wrapper>
          <TwoFaConsumer />
        </Wrapper>
      )
    ).toThrow("useTwoFaModal must be used inside TwoFaModalProvider");
    consoleError.mockRestore();
  });

  it("renders children without showing modal initially", () => {
    render(
      <Wrapper>
        <TwoFaModalProvider>
          <span>App</span>
        </TwoFaModalProvider>
      </Wrapper>
    );
    expect(screen.getByText("App")).toBeInTheDocument();
    // The modal section is not rendered when closed
    expect(screen.queryByText("2-Step Verification")).not.toBeInTheDocument();
  });

  it("opens modal when open() is called", async () => {
    render(
      <Wrapper>
        <TwoFaModalProvider>
          <TwoFaConsumer />
        </TwoFaModalProvider>
      </Wrapper>
    );
    fireEvent.click(screen.getByText("Open 2FA"));
    // The modal shows the header (may be in loading state briefly, but since send is mocked as non-pending, content should show)
    expect(screen.getByText("Verify")).toBeInTheDocument();
  });

  it("useTwoFaModal returns open and close functions inside provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Wrapper>
        <TwoFaModalProvider>{children}</TwoFaModalProvider>
      </Wrapper>
    );

    const { result } = renderHook(() => useTwoFaModal(), {
      wrapper,
    });

    expect(typeof result.current.open).toBe("function");
    expect(typeof result.current.close).toBe("function");
  });
});
