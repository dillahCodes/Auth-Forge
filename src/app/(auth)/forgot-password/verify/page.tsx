"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { InputText } from "@/shared/components/ui/input/input-text";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { useForgotPasswordVerify } from "@/features/auth/hooks/use-forgot-password-verify";
import { forgotPasswordSchema } from "@/features/auth/schemas/forgot-password.schema";
import { getFieldError } from "@/shared/utils/response-helper";
import { ApiResponse } from "@/shared/types/response";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { Activity, useEffect, useMemo } from "react";
import { RiRotateLockFill } from "react-icons/ri";
import z from "zod";

interface MessageBoxType {
  condition: boolean;
  message: string;
  type: "success" | "error";
}

export default function ForgotPasswordVerifyPage() {
  const searchparam = useSearchParams();
  const email = searchparam.get("email");
  const token = searchparam.get("token");

  const { mutate, status, data, reset, error } = useForgotPasswordVerify();
  const axiosSendForgotPasswordError = error as AxiosError<ApiResponse>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    mutate(data as z.infer<typeof forgotPasswordSchema>);
  };

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

  useEffect(() => {
    if (!message) return;

    const timeOutId = setTimeout(() => {
      reset();
    }, 5000);

    return () => clearTimeout(timeOutId);
  }, [reset, message]);

  return (
    <section className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleSubmit}>
        <FormHeader icon={RiRotateLockFill} title="Change Password" description="Enter your new password to continue" />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
        </Activity>

        <InputText
          labelProps={{ htmlFor: "email" }}
          inputProps={{
            id: "email",
            name: "email",
            defaultValue: email || "",
            readOnly: true,
          }}
          wrapperProps={{ className: "hidden" }}
        />

        <InputText
          labelProps={{ htmlFor: "token" }}
          inputProps={{
            id: "token",
            name: "token",
            defaultValue: token || "",
            readOnly: true,
          }}
          wrapperProps={{ className: "hidden" }}
        />

        <InputPassword
          labelProps={{ htmlFor: "password" }}
          inputProps={{
            id: "password",
            placeholder: "New password...",
            name: "password",
          }}
          errorMessage={axiosSendForgotPasswordError && getFieldError(axiosSendForgotPasswordError, "password")}
        />

        <InputPassword
          labelProps={{ htmlFor: "confirmPassword" }}
          inputProps={{
            id: "confirmPassword",
            placeholder: "Confirm password...",
            name: "confirmPassword",
          }}
          errorMessage={axiosSendForgotPasswordError && getFieldError(axiosSendForgotPasswordError, "confirmPassword")}
        />
        <Button variant="info" type="submit" className="font-semibold" disabled={status === "pending"}>
          {status === "pending" ? "Loading..." : "Change Password"}
        </Button>
      </Form>
    </section>
  );
}
