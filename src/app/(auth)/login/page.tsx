"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputEmail } from "@/shared/components/ui/input/input-email";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { useLogin } from "@/features/auth/hooks/use-login";
import { getFieldError } from "@/shared/utils/response-helper";
import { ApiResponse } from "@/shared/types/response";
import { AxiosError } from "axios";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { Activity, useEffect, useMemo } from "react";
import { MessageBox } from "@/shared/components/ui/messagebox";

interface MessageBoxType {
  condition: boolean;
  message: string;
  type: "success" | "error";
}

export default function Login() {
  const { mutate: login, isPending, error, data, status, reset } = useLogin();
  const axiosError = error as AxiosError<ApiResponse>;

  const message = useMemo(() => {
    const conditions: MessageBoxType[] = [
      {
        condition: status === "success",
        message: data?.message as string,
        type: "success",
      },
      {
        condition: status === "error",
        message: axiosError?.response?.data.message as string,
        type: "error",
      },
    ];

    const match = conditions.find((i) => Boolean(i.condition));
    return match || null;
  }, [data, status, axiosError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(new FormData(e.currentTarget));
  };

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
        <FormHeader icon={FaRegUserCircle} title="Welcome Back" description="Login to continue where you left off" />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
        </Activity>

        <InputEmail
          errorMessage={axiosError && getFieldError(axiosError, "email")}
          inputProps={{ id: "email", name: "email", placeholder: "Email" }}
        />
        <InputPassword
          errorMessage={axiosError && getFieldError(axiosError, "password")}
          inputProps={{ name: "password", id: "password", placeholder: "Password" }}
        />

        <div className="flex justify-between text-xs">
          <Link href="/register" className="underline">
            Register
          </Link>
          <Link href="/forgot-password" className="underline">
            Forgot Password
          </Link>
        </div>

        <Button variant="info" type="submit" className="font-semibold">
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </section>
  );
}
