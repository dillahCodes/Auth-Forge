"use client";

import { useEmailSendVerify } from "@/features/auth/hooks/auth-email-verification/use-email-send-verify";
import { useEmailVerify } from "@/features/auth/hooks/auth-email-verification/use-email-verify";
import { useOtp } from "@/features/auth/hooks/use-otp";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputOtp } from "@/shared/components/ui/input/input-otp";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { useCountdown } from "@/shared/hooks/use-countdown";
import { ApiResponse } from "@/shared/types/response";
import { getResendButtonText } from "@/shared/utils/get-resend-button-text";
import { AxiosError } from "axios";
import { Activity } from "react";
import { LuMailCheck } from "react-icons/lu";

const COUNTDOWN_CONFIG = { key: "email-verify-countdown", timeoutSeconds: 120 };

export default function VerifyEmailPage() {
  const { internalState, startCountdown } = useCountdown(COUNTDOWN_CONFIG);
  const { otpLength, handleOtpInputChange, handleKeyDown, handlePaste, inputsRef } = useOtp({ otpLength: 6 });

  const {
    mutate: reqVerify,
    isPending: isReqPending,
    error: reqError,
    status: reqStatus,
    data: reqData,
    reset: reqResetState,
  } = useEmailSendVerify();

  const {
    mutate: verify,
    isPending: isVerifyPending,
    error: verifyError,
    status: verifyStatus,
    data: verifyData,
    reset: verifyResetState,
  } = useEmailVerify();

  const axiosReqError = reqError as AxiosError<ApiResponse>;
  const axiosVerifyError = verifyError as AxiosError<ApiResponse>;

  const flows: BuildError[] = [
    { status: reqStatus, data: reqData, error: axiosReqError },
    { status: verifyStatus, data: verifyData, error: axiosVerifyError },
  ];

  const message = useBuildAxiosError({ errors: flows, resetState: [reqResetState, verifyResetState] });

  const handleVerifyEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = [...formData.values()].join("");
    verify({ otp: result });
  };

  const handleReqVerifyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reqVerify();
    startCountdown();
  };

  const { isCountdownDone, remaining } = internalState;
  const resendButtonText = getResendButtonText({ isReqPending, isCountdownDone, remaining });

  return (
    <section className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleVerifyEmail}>
        <FormHeader
          title="Verify Your Email Address"
          icon={LuMailCheck}
          description="Please enter the 6-digit code sent to your email"
        />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
        </Activity>

        <InputOtp
          handleOtpInputChange={handleOtpInputChange}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
          inputsRef={inputsRef}
          otpLength={otpLength}
        />

        <div className="text-xs mt-1">
          <Button
            variant="text"
            type="button"
            onClick={handleReqVerifyEmail}
            disabled={isReqPending || !isCountdownDone}
            className="underline disabled:opacity-50"
          >
            {resendButtonText}
          </Button>
        </div>

        <Button variant="info" type="submit" className="font-semibold" disabled={isVerifyPending || isReqPending}>
          {isVerifyPending ? "Verifying..." : "Verify Email"}
        </Button>
      </Form>
    </section>
  );
}
