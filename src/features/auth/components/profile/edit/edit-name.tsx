import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { InputText } from "@/shared/components/ui/input/input-text";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity } from "react";
import { LuIdCard } from "react-icons/lu";
import { useChangeName } from "../../../hooks/use-change-name";
import { ChangeNameSchema } from "../../../schemas/account.schema";

export default function EditName({ defaultValue }: { defaultValue?: string }) {
  const { mutate, status, data, reset, error } = useChangeName();
  const axiosError = error as AxiosError<ApiResponse>;

  const flows: BuildError[] = [{ data: data, error: axiosError, status }];
  const message = useBuildAxiosError({ errors: flows, resetState: reset });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    mutate(data as ChangeNameSchema);
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4!">
      <h2 className="font-bold mb-2">Name</h2>

      <Activity mode={message ? "visible" : "hidden"}>
        <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
      </Activity>

      <InputText
        labelIcon={LuIdCard}
        errorMessage={axiosError && getFieldError(axiosError, "name")}
        labelProps={{ htmlFor: "name" }}
        inputProps={{ id: "name", name: "name", placeholder: "Name", defaultValue }}
      />

      <Button variant="info" type="submit" className="font-semibold" disabled={status === "pending"}>
        {status === "pending" ? "Loading..." : "Change Name"}
      </Button>
    </Form>
  );
}
