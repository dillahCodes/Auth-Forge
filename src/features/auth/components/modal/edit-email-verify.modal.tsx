import { useOtp } from "@/features/auth/hooks/use-otp";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputOtp } from "@/shared/components/ui/input/input-otp";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { getCountdownRemaining, useCountdown } from "@/shared/hooks/use-countdown";
import { ApiResponse } from "@/shared/types/response";
import { getResendButtonText } from "@/shared/utils/get-resend-button-text";
import { AxiosError } from "axios";
import {
  Activity,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useChangeEmailVerificationSend } from "../../hooks/use-change-email-verification-send";
import { useChangeEmailVerificationVerify } from "../../hooks/use-change-email-verification-verify";

export type VerifyChangeEmailConfig = {
  featureKey: string;
  timeoutSeconds: number;
  otpLength: number;
};

interface OpenVerifyChangeEmailModalProps {
  config: VerifyChangeEmailConfig;
  sendToEmail: string;
  afterVerify?: () => void;
}

interface VerifyChangeEmailModalController {
  open(props: OpenVerifyChangeEmailModalProps): void;
  close(): void;
}

type VerifyChangeEmailModalHandle = VerifyChangeEmailModalController;

const VerifyChangeEmailModalContext = createContext<VerifyChangeEmailModalController | null>(null);

//  DOC: Verify Change Email Modal provider
export function VerifyChangeEmailModalProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<VerifyChangeEmailModalHandle>(null);

  const controller: VerifyChangeEmailModalController = {
    open: (props) => ref.current?.open(props),
    close: () => ref.current?.close(),
  };

  return (
    <VerifyChangeEmailModalContext.Provider value={controller}>
      {children}
      <VerifyChangeEmailModal ref={ref} />
    </VerifyChangeEmailModalContext.Provider>
  );
}

//  DOC: Verify Change Email Modal hook
export function useVerifyChangeEmailModal() {
  const ctx = useContext(VerifyChangeEmailModalContext);

  if (!ctx) throw new Error("useVerifyChangeEmailModal must be used inside VerifyChangeEmailModalProvider");
  return ctx;
}

const DEFAULT_CONFIG = Object.freeze({
  config: { featureKey: "", timeoutSeconds: 0, otpLength: 0 },
  sendToEmail: "",
} satisfies OpenVerifyChangeEmailModalProps);

export const VerifyChangeEmailModal = forwardRef<VerifyChangeEmailModalHandle>(function VerifyChangeEmailModal(_, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [ctx, setCtx] = useState<OpenVerifyChangeEmailModalProps>(DEFAULT_CONFIG);

  const { sendToEmail } = ctx;

  //  DOC: OTP send and verify hooks for change email verification
  const sendHook = useChangeEmailVerificationSend();
  const verifyHook = useChangeEmailVerificationVerify();

  //  DOC: Countdown and OTP input configuration
  const countdownConfig = { key: ctx.config.featureKey, timeoutSeconds: ctx.config.timeoutSeconds };
  const otpConfig = { otpLength: ctx.config.otpLength };

  const { startCountdown, internalState } = useCountdown(countdownConfig);
  const { otpLength, handleOtpInputChange, handleKeyDown, handlePaste, inputsRef } = useOtp(otpConfig);

  //   DOC: Verify Change Email Modal handler
  const modalHandler = () => ({
    open: (props: OpenVerifyChangeEmailModalProps) => {
      setCtx(props);
      setIsOpen(true);
      document.body.classList.add("overflow-hidden");
    },
    close: () => {
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
    },
  });

  useImperativeHandle(ref, modalHandler, []);

  // DOC: Loading state for OTP request & verification
  const isReqPending = sendHook.isPending;
  const isVerifyPending = verifyHook.isPending;

  // DOC: Resend button countdown state
  const { isCountdownDone, remaining } = internalState;
  const resendButtonText = getResendButtonText({ isReqPending, isCountdownDone, remaining });

  // DOC: Error message builder for send & verify flows
  const axiosReqError = sendHook.error as AxiosError<ApiResponse>;
  const axiosVerifyError = verifyHook.error as AxiosError<ApiResponse>;

  const flowsError: BuildError[] = [
    { status: sendHook.status, data: sendHook.data, error: axiosReqError },
    { status: sendHook.status, data: sendHook.data, error: axiosVerifyError },
  ];

  const twoFaMessage = useBuildAxiosError({
    errors: flowsError,
    resetState: [sendHook.reset, verifyHook.reset],
  });

  // DOC: Auto send OTP when modal opens (change email verification)
  const handleSendOtp = useEffectEvent(async () => {
    const countdownLocalStorage = getCountdownRemaining(countdownConfig);
    if (!countdownLocalStorage.isCountdownDone) return;

    await sendHook.mutateAsync();
    startCountdown();
  });

  useEffect(() => {
    if (!isOpen) return;
    handleSendOtp();
  }, [isOpen]);

  // DOC: Verify Change Email OTP submit handler
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isVerifyPending) return;

    const formData = new FormData(e.currentTarget);
    const otp = [...formData.values()].join("");

    await verifyHook.mutateAsync({ otp });
    ctx.afterVerify?.();
    modalHandler().close();
  };

  // DOC: Resend OTP handler for change email verification
  const handleResend = async () => {
    if (isReqPending) return;
    await sendHook.mutateAsync();
    startCountdown();
  };

  if (!isOpen) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => !isVerifyPending && setIsOpen(false)}
    >
      <Form onSubmit={handleVerify} onClick={(e) => e.stopPropagation()} className="max-w-md w-full bg-white p-6">
        <Activity name="verify change email loading" mode={isOpen && isReqPending ? "visible" : "hidden"}>
          <div className="w-full h-full flex items-center justify-center">
            <AiOutlineLoading3Quarters size={24} className="animate-spin" />
          </div>
        </Activity>

        <Activity name="verify change email content" mode={isOpen && !isReqPending ? "visible" : "hidden"}>
          <FormHeader
            title="Verify Email Change"
            icon={MdOutlineMarkEmailRead}
            description={`Enter the verification code sent to ${sendToEmail}`}
          />

          <Activity mode={twoFaMessage ? "visible" : "hidden"}>
            <MessageBox type={twoFaMessage?.type as "success" | "error"}>{twoFaMessage?.message}</MessageBox>
          </Activity>

          <InputOtp
            handleOtpInputChange={handleOtpInputChange}
            handleKeyDown={handleKeyDown}
            handlePaste={handlePaste}
            inputsRef={inputsRef}
            otpLength={otpLength}
          />

          <Button
            variant="text"
            type="button"
            onClick={handleResend}
            disabled={isReqPending || !isCountdownDone}
            className="underline disabled:opacity-50"
          >
            {resendButtonText}
          </Button>

          <Button variant="info" type="submit" className="mt-4 w-full font-bold" disabled={isVerifyPending}>
            {isVerifyPending ? "Verifying email change..." : "Verify Email"}
          </Button>
        </Activity>
      </Form>
    </section>
  );
});
