"use client";

import { useLogin } from "@/features/auth/hooks/use-login";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputEmail } from "@/shared/components/ui/input/input-email";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import Link from "next/link";
import { Activity } from "react";
import { FaRegUserCircle } from "react-icons/fa";

export default function Login() {
  const { mutate: login, isPending, error, data, status, reset } = useLogin();
  const axiosError = error as AxiosError<ApiResponse>;

  const flows: BuildError[] = [{ data: data, error: axiosError, status }];
  const message = useBuildAxiosError({ errors: flows, resetState: reset });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(new FormData(e.currentTarget));
  };

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
          <Link href="/forgot-password" className="underline">
            Forgot Password
          </Link>
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>

        <Button variant="info" type="submit" className="font-semibold">
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </section>
  );
}
