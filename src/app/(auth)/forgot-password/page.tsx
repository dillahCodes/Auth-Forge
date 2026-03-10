"use client";

import { useForgotPasswordSend } from "@/features/auth/hooks/auth-forgot-password/use-forgot-password-send";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputEmail } from "@/shared/components/ui/input/input-email";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity } from "react";
import { TbLockPassword } from "react-icons/tb";

export default function ForgotPassword() {
  const { mutate, status, data, reset, error } = useForgotPasswordSend();
  const axiosError = error as AxiosError<ApiResponse>;

  const flows: BuildError[] = [{ data: data, error: axiosError, status }];
  const message = useBuildAxiosError({ errors: flows, resetState: reset });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const emailPayload = formData.get("email") as string;
    const isEmpty = !emailPayload.trim().length;

    if (isEmpty) return;
    mutate({ email: emailPayload as string });
  };

  return (
    <section className="flex flex-col gap-6 w-full max-w-md p-3">
      <Form onSubmit={handleSubmit}>
        <FormHeader
          icon={TbLockPassword}
          title="Forgot Password"
          description="Enter your email to reset your password"
        />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
        </Activity>

        <InputEmail
          errorMessage={axiosError && getFieldError(axiosError, "email")}
          inputProps={{ id: "email", name: "email", placeholder: "Enter your email address...", required: true }}
        />

        <Button variant="info" type="submit" disabled={status === "pending"} className="font-semibold">
          {status === "pending" ? "Sending..." : "Send"}
        </Button>
      </Form>
    </section>
  );
}
