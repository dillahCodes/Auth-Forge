"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { FormHeader } from "@/components/ui/form/form-header";
import { InputEmail } from "@/components/ui/input/input-email";
import { InputPassword } from "@/components/ui/input/input-password";
import { useLogin } from "@/features/auth/hooks/use-login";
import { getFieldError } from "@/helper/response-helper";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";

export default function Login() {
  const { mutate: login, isPending, error } = useLogin();
  const axiosError = error as AxiosError<ApiResponse>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(new FormData(e.currentTarget));
  };

  return (
    <section className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleSubmit}>
        <FormHeader
          icon={FaRegUserCircle}
          title="Welcome Back"
          description="Login to continue where you left off"
        />
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
