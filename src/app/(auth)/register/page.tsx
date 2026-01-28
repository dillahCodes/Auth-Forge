"use client";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputEmail } from "@/shared/components/ui/input/input-email";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { InputText } from "@/shared/components/ui/input/input-text";
import { useRegister } from "@/features/auth/hooks/use-register";
import { getFieldError } from "@/shared/utils/response-helper";
import { ApiResponse } from "@/shared/types/response";
import { AxiosError } from "axios";
import { LuIdCard } from "react-icons/lu";
import { Activity, useEffect, useMemo } from "react";
import { MessageBox } from "@/shared/components/ui/messagebox";

interface MessageBoxType {
  condition: boolean;
  message: string;
  type: "success" | "error";
}

export default function Register() {
  const { mutate: register, error, isPending, data, status, reset } = useRegister();
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
    register(new FormData(e.currentTarget));
  };

  useEffect(() => {
    if (!message) return;

    const timeOutId = setTimeout(() => {
      reset();
    }, 5000);

    return () => clearTimeout(timeOutId);
  }, [reset, message]);

  return (
    <main className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleSubmit}>
        <FormHeader icon={LuIdCard} title="Create Account" description="Enter your details to get started" />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
        </Activity>

        <InputText
          labelIcon={LuIdCard}
          errorMessage={axiosError && getFieldError(axiosError, "name")}
          labelProps={{ htmlFor: "name" }}
          inputProps={{ id: "name", name: "name", placeholder: "Name" }}
        />
        <InputEmail
          labelProps={{ htmlFor: "email" }}
          errorMessage={axiosError && getFieldError(axiosError, "email")}
          inputProps={{ id: "email", name: "email", placeholder: "Email" }}
        />
        <InputPassword
          errorMessage={axiosError && getFieldError(axiosError, "password")}
          labelProps={{ htmlFor: "password" }}
          inputProps={{ id: "password", name: "password", placeholder: "Password" }}
        />
        <Button variant="info" className="font-semibold">
          {isPending ? "Registering..." : "Register"}
        </Button>
      </Form>
    </main>
  );
}
