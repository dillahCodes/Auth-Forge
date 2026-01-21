"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/form";
import { FormHeader } from "@/components/ui/form/form-header";
import { InputEmail } from "@/components/ui/input/input-email";
import { InputPassword } from "@/components/ui/input/input-password";
import { InputText } from "@/components/ui/input/input-text";
import { useRegister } from "@/features/auth/hooks/use-register";
import { getFieldError } from "@/helper/response-helper";
import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { LuIdCard } from "react-icons/lu";

export default function Register() {
  const { mutate: register, error, isPending } = useRegister();
  const axiosError = error as AxiosError<ApiResponse>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(new FormData(e.currentTarget));
  };

  return (
    <main className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleSubmit}>
        <FormHeader
          icon={LuIdCard}
          title="Create Account"
          description="Enter your details to get started"
        />
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
