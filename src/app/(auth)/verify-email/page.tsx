"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { useEmailSendVerify } from "@/features/auth/hooks/use-email-send-verify";
import { useEmailVerify } from "@/features/auth/hooks/use-email-verify";
import { useOtp } from "@/features/auth/hooks/use-otp";
import { useCountdown } from "@/shared/hooks/use-countdown";
import { ApiResponse } from "@/shared/types/response";
import { AxiosError } from "axios";
import { Activity, useEffect, useMemo } from "react";
import { LuMailCheck } from "react-icons/lu";

interface MessageBoxType {
  condition: boolean;
  message: string;
  type: "success" | "error";
}

export default function VerifyEmailPage() {
  const { isCountdownDone, remaining, setCountDownvalue } = useCountdown({
    key: "email-verify-countdown",
    timeoutSeconds: 0,
  });

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

  const handleVerifyEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = [...formData.values()].join("");
    verify({ otp: result });
  };

  const handleReqVerifyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reqVerify();
    setCountDownvalue(Date.now().toString());
  };

  const resendButtonText = useMemo(() => {
    if (isReqPending) return "Sending...";
    if (!isCountdownDone) return `Resend in ${remaining}s`;
    return "Resend Code";
  }, [isReqPending, isCountdownDone, remaining]);

  const message = useMemo(() => {
    const conditions: MessageBoxType[] = [
      {
        condition: reqStatus === "success",
        message: reqData?.message as string,
        type: "success",
      },
      {
        condition: verifyStatus === "success",
        message: verifyData?.message as string,
        type: "success",
      },
      {
        condition: reqStatus === "error",
        message: axiosReqError?.response?.data.message as string,
        type: "error",
      },
      {
        condition: verifyStatus === "error",
        message: axiosVerifyError?.response?.data.message as string,
        type: "error",
      },
    ];

    const match = conditions.find((i) => Boolean(i.condition));
    return match || null;
  }, [reqData, reqStatus, verifyData, verifyStatus, axiosReqError, axiosVerifyError]);

  useEffect(() => {
    if (!message) return;

    const timeOutId = setTimeout(() => {
      reqResetState();
      verifyResetState();
    }, 5000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [reqResetState, verifyResetState, message]);

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

        <div className="w-full grid grid-cols-6 gap-3">
          {Array.from({ length: otpLength }).map((_, index) => (
            <input
              ref={(el) => {
                inputsRef.current[index] = el!;
              }}
              name={index.toString()}
              required
              maxLength={1}
              inputMode="numeric"
              onPaste={handlePaste}
              onChange={(e) => handleOtpInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              type="text"
              key={index}
              className="border-2 border-black min-h-10 text-center aspect-square text-lg font-semibold"
            />
          ))}
        </div>

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
