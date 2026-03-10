"use client";

import { useRegister } from "@/features/auth/hooks/auth-credentials/use-register";
import { useGoogleAuth } from "@/features/auth/hooks/auth-google/use-google-auth";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputEmail } from "@/shared/components/ui/input/input-email";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { InputText } from "@/shared/components/ui/input/input-text";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuIdCard } from "react-icons/lu";

export default function Register() {
  const { mutate: loginWithGoogle, isPending: isGooglePending } = useGoogleAuth();
  const { mutate: register, error, isPending, data, status, reset } = useRegister();
  const axiosError = error as AxiosError<ApiResponse>;

  const flows: BuildError[] = [{ data: data, error: axiosError, status }];
  const message = useBuildAxiosError({ errors: flows, resetState: reset });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(new FormData(e.currentTarget));
  };

  return (
    <main className="flex flex-col gap-6 w-full max-w-md p-3">
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
        <InputPassword
          errorMessage={axiosError && getFieldError(axiosError, "confirmPassword")}
          labelProps={{ htmlFor: "confirmPassword" }}
          inputProps={{ id: "confirmPassword", name: "confirmPassword", placeholder: "Confirm Password" }}
        />

        <Button type="submit" variant="info" className="font-semibold" disabled={isPending} isLoading={isPending}>
          Register
        </Button>

        <div className="flex items-center justify-center gap-3">
          <div className="w-full bg-black h-0.5" />
          <span className="text-sm">Or</span>
          <div className="w-full bg-black h-0.5" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => loginWithGoogle()}
          iconLeft={<FcGoogle size={24} />}
          isLoading={isGooglePending}
          disabled={isGooglePending}
          className="font-semibold"
        >
          Register with Google
        </Button>
      </Form>
    </main>
  );
}
