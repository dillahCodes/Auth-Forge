import { useTwoFaSend } from "@/features/auth/hooks/auth-2fa/use-2fa-send";
import { useTwoFaVerify } from "@/features/auth/hooks/auth-2fa/use-2fa-verify";
import { useOtp } from "@/features/auth/hooks/use-otp";
import { TwoFaScopeSchema } from "@/features/auth/schemas/2fa.schema";
import { Button } from "@/shared/components/ui/button";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputOtp } from "@/shared/components/ui/input/input-otp";
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
import { GoShield } from "react-icons/go";
import { Form } from "../form/form";
import { MessageBox } from "../messagebox";

export type TwoFaConfig = {
  featureKey: string;
  timeoutSeconds: number;
  otpLength: number;
};

interface OpenTwoFaModalProps {
  config: TwoFaConfig;
  sendToEmail: string;
  scope: TwoFaScopeSchema["scope"];
  afterVerify?: () => void;
}

interface TwoFaModalController {
  open(props: OpenTwoFaModalProps): void;
  close(): void;
}

type TwoFaModalHandle = TwoFaModalController;

const TwoFaModalContext = createContext<TwoFaModalController | null>(null);

//  DOC: 2fa Modal provider
export function TwoFaModalProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<TwoFaModalHandle>(null);

  const controller: TwoFaModalController = {
    open: (props) => ref.current?.open(props),
    close: () => ref.current?.close(),
  };

  return (
    <TwoFaModalContext.Provider value={controller}>
      {children}
      <TwoFaModal ref={ref} />
    </TwoFaModalContext.Provider>
  );
}

//  DOC: 2fa Modal hook
export function useTwoFaModal() {
  const ctx = useContext(TwoFaModalContext);

  if (!ctx) throw new Error("useTwoFaModal must be used inside TwoFaModalProvider");
  return ctx;
}

const DEFAULT_CONFIG = Object.freeze({
  config: { featureKey: "", timeoutSeconds: 0, otpLength: 0 },
  sendToEmail: "",
  scope: "CHANGE_EMAIL",
} satisfies OpenTwoFaModalProps);

export const TwoFaModal = forwardRef<TwoFaModalHandle>(function TwoFaModal(_, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [ctx, setCtx] = useState<OpenTwoFaModalProps>(DEFAULT_CONFIG);

  const { scope, sendToEmail } = ctx;

  //  DOC: 2fa send and verify hooks
  const sendHook = useTwoFaSend();
  const verifyHook = useTwoFaVerify();

  //  DOC: hook config
  const countdownConfig = { key: ctx.config.featureKey, timeoutSeconds: ctx.config.timeoutSeconds };
  const otpConfig = { otpLength: ctx.config.otpLength };

  const { startCountdown, internalState } = useCountdown(countdownConfig);
  const { otpLength, handleOtpInputChange, handleKeyDown, handlePaste, inputsRef } = useOtp(otpConfig);

  //   DOC: 2fa Modal handler
  const modalHandler = () => ({
    open: (props: OpenTwoFaModalProps) => {
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

  // DOC: 2fa Resend button loading handler
  const isReqPending = sendHook.isPending;
  const isVerifyPending = verifyHook.isPending;

  // DOC: 2fa Resend button countdown and resend button handler
  const { isCountdownDone, remaining } = internalState;
  const resendButtonText = getResendButtonText({ isReqPending, isCountdownDone, remaining });

  // DOC: 2fa Error Message
  const axiosReqError = sendHook.error as AxiosError<ApiResponse>;
  const axiosVerifyError = verifyHook.error as AxiosError<ApiResponse>;

  const flowsError: BuildError[] = [
    { status: sendHook.status, data: sendHook.data, error: axiosReqError },
    { status: verifyHook.status, data: verifyHook.data, error: axiosVerifyError },
  ];

  const twoFaMessage = useBuildAxiosError({ errors: flowsError, resetState: [sendHook.reset, verifyHook.reset] });

  // DOC: auto send 2fa whan modal open
  const handleSendOtp = useEffectEvent(async () => {
    const countdownLocalStorage = getCountdownRemaining(countdownConfig);
    if (!countdownLocalStorage.isCountdownDone) return;

    await sendHook.mutateAsync({ scope });
    startCountdown();
  });

  useEffect(() => {
    if (!isOpen) return;
    handleSendOtp();
  }, [isOpen]);

  // DOC: 2fa Verify button handler
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isVerifyPending) return;

    const formData = new FormData(e.currentTarget);
    const otp = [...formData.values()].join("");

    await verifyHook.mutateAsync({ otp, scope });
    ctx.afterVerify?.();
    modalHandler().close();
  };

  // DOC: 2fa Resend button handler
  const handleResend = async () => {
    if (isReqPending) return;
    await sendHook.mutateAsync({ scope });
    startCountdown();
  };

  if (!isOpen) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => !isVerifyPending && setIsOpen(false)}
    >
      <Form onSubmit={handleVerify} onClick={(e) => e.stopPropagation()} className="max-w-md w-full bg-white p-6">
        <Activity name="2fa modal loading" mode={isOpen && isReqPending ? "visible" : "hidden"}>
          <div className="w-full h-full flex items-center justify-center">
            <AiOutlineLoading3Quarters size={24} className="animate-spin" />
          </div>
        </Activity>

        <Activity name="2fa modal content" mode={isOpen && !isReqPending ? "visible" : "hidden"}>
          <FormHeader
            title="2-Step Verification"
            icon={GoShield}
            description={`Enter the code sent to ${sendToEmail}`}
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
            {isVerifyPending ? "Verifying..." : "Verify"}
          </Button>
        </Activity>
      </Form>
    </section>
  );
});
