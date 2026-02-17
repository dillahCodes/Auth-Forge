import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { useModal } from "@/shared/components/ui/modal/modal";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity } from "react";
import { useChangePassword } from "../../../hooks/use-change-password";
import { ChangePasswordSchema } from "../../../schemas/account.schema";

export default function EditPassword() {
  const modal = useModal();
  const { status, data, reset, error, mutateAsync } = useChangePassword();
  const axiosError = error as AxiosError<ApiResponse>;

  const flows: BuildError[] = [{ data: data, error: axiosError, status }];
  const message = useBuildAxiosError({ errors: flows, resetState: reset });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    modal.open({
      title: "Change Password",
      content: "Changing your password will require you to log in again. Continue?",
      onConfirm: async () => {
        await mutateAsync(data as ChangePasswordSchema);
      },
    });
  };

  return (
    <Form className="p-4!" onSubmit={handleSubmit}>
      <h2 className="font-bold mb-2">Password</h2>

      <Activity mode={message ? "visible" : "hidden"}>
        <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
      </Activity>

      <InputPassword
        errorMessage={axiosError && getFieldError(axiosError, "currentPassword")}
        labelProps={{ htmlFor: "currentPassword" }}
        inputProps={{ id: "currentPassword", name: "currentPassword", placeholder: "Current Password" }}
      />

      <InputPassword
        errorMessage={axiosError && getFieldError(axiosError, "password")}
        labelProps={{ htmlFor: "password" }}
        inputProps={{ id: "password", name: "password", placeholder: "New Password" }}
      />

      <InputPassword
        errorMessage={axiosError && getFieldError(axiosError, "confirmPassword")}
        labelProps={{ htmlFor: "confirmPassword" }}
        inputProps={{ id: "confirmPassword", name: "confirmPassword", placeholder: "Confirm New Password" }}
      />

      <Button variant="info" className="w-full font-bold">
        Edit Password
      </Button>
    </Form>
  );
}
