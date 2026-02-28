import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VerifyChangeEmailModalProvider, useVerifyChangeEmailModal } from "../edit-email-verify.modal";

// Mock all external hooks the modal depends on
vi.mock("@/features/auth/hooks/profile-email/use-change-email-verification-send", () => ({
  useChangeEmailVerificationSend: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
    status: "idle",
    data: null,
    reset: vi.fn(),
  }),
}));

vi.mock("@/features/auth/hooks/profile-email/use-change-email-verification-verify", () => ({
  useChangeEmailVerificationVerify: () => ({
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

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function ModalConsumer() {
  const modal = useVerifyChangeEmailModal();
  return (
    <button
      onClick={() =>
        modal.open({
          config: { featureKey: "change-email", timeoutSeconds: 60, otpLength: 6 },
          sendToEmail: "user@test.com",
        })
      }
    >
      Open Verify Email Modal
    </button>
  );
}

describe("VerifyChangeEmailModalProvider & useVerifyChangeEmailModal", () => {
  const Wrapper = createWrapper();

  it("throws when useVerifyChangeEmailModal is used outside provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Wrapper>
          <ModalConsumer />
        </Wrapper>
      )
    ).toThrow("useVerifyChangeEmailModal must be used inside VerifyChangeEmailModalProvider");
    consoleError.mockRestore();
  });

  it("renders children without showing modal initially", () => {
    render(
      <Wrapper>
        <VerifyChangeEmailModalProvider>
          <span>App Content</span>
        </VerifyChangeEmailModalProvider>
      </Wrapper>
    );
    expect(screen.getByText("App Content")).toBeInTheDocument();
    expect(screen.queryByText("Verify Email Change")).not.toBeInTheDocument();
  });

  it("opens modal when open() is called", () => {
    render(
      <Wrapper>
        <VerifyChangeEmailModalProvider>
          <ModalConsumer />
        </VerifyChangeEmailModalProvider>
      </Wrapper>
    );
    fireEvent.click(screen.getByText("Open Verify Email Modal"));
    expect(screen.getByText("Verify Email Change")).toBeInTheDocument();
  });

  it("shows sendToEmail in the modal description", () => {
    render(
      <Wrapper>
        <VerifyChangeEmailModalProvider>
          <ModalConsumer />
        </VerifyChangeEmailModalProvider>
      </Wrapper>
    );
    fireEvent.click(screen.getByText("Open Verify Email Modal"));
    expect(screen.getByText(/user@test\.com/)).toBeInTheDocument();
  });

  it("useVerifyChangeEmailModal returns open and close functions", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Wrapper>
        <VerifyChangeEmailModalProvider>{children}</VerifyChangeEmailModalProvider>
      </Wrapper>
    );

    const { result } = renderHook(() => useVerifyChangeEmailModal(), {
      wrapper,
    });

    expect(typeof result.current.open).toBe("function");
    expect(typeof result.current.close).toBe("function");
  });
});
