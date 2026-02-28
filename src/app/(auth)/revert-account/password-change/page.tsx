"use client";

import { useRevertAccountPasswordChange } from "@/features/auth/hooks/profile-revert-account/use-revert-account-password-change";
import { RevertAccountSchema } from "@/features/auth/schemas/revert-account.schema";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { FormHeader } from "@/shared/components/ui/form/form-header";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { InputText } from "@/shared/components/ui/input/input-text";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import { RiRotateLockFill } from "react-icons/ri";

export default function RevertAccountPasswordChange() {
  const searchparam = useSearchParams();
  const email = searchparam.get("email");
  const token = searchparam.get("token");
  const tokenId = searchparam.get("tokenId");

  const { mutate, status, data, reset, error } = useRevertAccountPasswordChange();
  const axiosError = error as AxiosError<ApiResponse>;

  const flows: BuildError[] = [{ data: data, error: axiosError, status }];
  const message = useBuildAxiosError({ errors: flows, resetState: reset });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    mutate(data as RevertAccountSchema);
  };

  return (
    <section className="flex flex-col gap-6 w-full max-w-md">
      <Form onSubmit={handleSubmit}>
        <FormHeader icon={RiRotateLockFill} title="Revert Account" description="Enter your new password to continue" />

        <Activity mode={message ? "visible" : "hidden"}>
          <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
        </Activity>

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

        <InputText
          labelProps={{ htmlFor: "tokenId" }}
          inputProps={{
            id: "tokenId",
            name: "tokenId",
            defaultValue: tokenId || "",
            readOnly: true,
          }}
          wrapperProps={{ className: "hidden" }}
        />

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

        <InputPassword
          labelProps={{ htmlFor: "password" }}
          inputProps={{
            id: "password",
            placeholder: "New password...",
            name: "password",
          }}
          errorMessage={axiosError && getFieldError(axiosError, "password")}
        />

        <InputPassword
          labelProps={{ htmlFor: "confirmPassword" }}
          inputProps={{
            id: "confirmPassword",
            placeholder: "Confirm password...",
            name: "confirmPassword",
          }}
          errorMessage={axiosError && getFieldError(axiosError, "confirmPassword")}
        />

        <Button variant="info" type="submit" className="font-semibold" disabled={status === "pending"}>
          {status === "pending" ? "Loading..." : "Submit"}
        </Button>
      </Form>
    </section>
  );
}
