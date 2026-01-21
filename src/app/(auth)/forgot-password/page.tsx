"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { FormHeader } from "@/components/ui/form/form-header";
import { InputEmail } from "@/components/ui/input/input-email";
import { MessageBox } from "@/components/ui/messagebox";
import { useForgotPasswordSend } from "@/features/auth/hooks/use-forgot-password-send";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { Activity, useEffect, useMemo } from "react";
import { TbLockPassword } from "react-icons/tb";

interface MessageBoxType {
  condition: boolean;
  message: string;
  type: "success" | "error";
}

export default function ForgotPassword() {
  const { mutate, status, data, reset, error } = useForgotPasswordSend();
  const axiosSendForgotPasswordError = error as AxiosError<ApiResponse>;

  const message = useMemo(() => {
    const conditions: MessageBoxType[] = [
      {
        condition: status === "success",
        message: data?.message as string,
        type: "success",
      },
      {
        condition: status === "error",
        message: axiosSendForgotPasswordError?.response?.data.message as string,
        type: "error",
      },
    ];

    const match = conditions.find((i) => Boolean(i.condition));
    return match || null;
  }, [data, status, axiosSendForgotPasswordError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const emailPayload = formData.get("email") as string;
    const isEmpty = !emailPayload.trim().length;

    if (isEmpty) return;
    mutate({ email: emailPayload as string });
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      reset();
    }, 5000);

    return () => clearTimeout(timeOutId);
  }, [reset]);

  return (
    <section className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleSubmit}>
        <FormHeader
          icon={TbLockPassword}
          title="Forgot Password"
          description="Enter your email to reset your password"
        />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>
            {message?.message}
          </MessageBox>
        </Activity>

        <InputEmail
          inputProps={{
            id: "email",
            name: "email",
            placeholder: "Enter your email address...",
            required: true,
          }}
        />

        <Button
          variant="info"
          type="submit"
          disabled={status === "pending"}
          className="font-semibold"
        >
          {status === "pending" ? "Sending..." : "Send"}
        </Button>
      </Form>
    </section>
  );
}
