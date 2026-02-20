import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { TwoFaConfig, useTwoFaModal } from "@/shared/components/ui/modal/modal-2fa";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity, useEffect, useEffectEvent, useState } from "react";
import { useChangePassword } from "../../../hooks/use-change-password";
import { ChangePasswordSchema } from "../../../schemas/account.schema";
import { useTwoFaStatus } from "@/features/auth/hooks/use-2fa-status";
import { StatusTwoFaToken } from "@/features/auth/types/2fa";

interface EditPasswordProps {
  defaultEmail?: string;
}

type FormDataChangePassword = ChangePasswordSchema | null;

const TWO_VERIFICATION_CONFIG: TwoFaConfig = { timeoutSeconds: 120, featureKey: "2fa-edit-password", otpLength: 6 };

export default function EditPassword({ defaultEmail }: EditPasswordProps) {
  const email = defaultEmail as string;
  const [formData, setFormData] = useState<FormDataChangePassword>(null);

  const twoFaModal = useTwoFaModal();

  const { data: twoFaStatusData, mutate: twoFaStatusMutate, isPending: isTwoFaStatusPending } = useTwoFaStatus();

  const {
    status: changePasswordStatus,
    data: changePasswordData,
    reset: changePasswordReset,
    error: changePasswordError,
    mutate: changePasswordMutate,
    isPending: isChangePasswordPending,
  } = useChangePassword();

  const isButtonSubmitLoading = isTwoFaStatusPending || isChangePasswordPending;

  const changePasswordErrorAxios = changePasswordError as AxiosError<ApiResponse>;

  const flows: BuildError[] = [
    { data: changePasswordData, error: changePasswordErrorAxios, status: changePasswordStatus },
  ];

  const message = useBuildAxiosError({ errors: flows, resetState: [changePasswordReset] });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as ChangePasswordSchema;

    setFormData(data);
    twoFaStatusMutate({ scope: "CHANGE_PASSWORD" });
  };

  const handleModalTwoFaOpen = useEffectEvent(() => {
    if (!formData) return;

    twoFaModal.open({
      config: TWO_VERIFICATION_CONFIG,
      sendToEmail: email,
      scope: "CHANGE_PASSWORD",
      afterVerify() {
        changePasswordMutate(formData);
      },
    });
  });

  const handleSendRequestChange = useEffectEvent(() => {
    if (!formData) return;
    changePasswordMutate(formData);
  });

  // DOC: open modal or directly send request password change based on 2fa status
  useEffect(() => {
    if (!twoFaStatusData) return;
    const StatusTwoFa = twoFaStatusData.data?.status as StatusTwoFaToken;

    const openModalConditions = [StatusTwoFaToken.INVALID_SCOPE, StatusTwoFaToken.MISSING];
    const shouldOpenModal = openModalConditions.includes(StatusTwoFa);

    if (shouldOpenModal) handleModalTwoFaOpen();

    const sendRequestChangeCondition = [StatusTwoFaToken.AVAILABLE];
    const shouldSendRequest = sendRequestChangeCondition.includes(StatusTwoFa);

    if (shouldSendRequest) handleSendRequestChange();
  }, [twoFaStatusData]);

  return (
    <Form className="p-4!" onSubmit={handleSubmit}>
      <h2 className="font-bold mb-2">Password</h2>

      <Activity mode={message ? "visible" : "hidden"}>
        <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
      </Activity>

      <InputPassword
        errorMessage={changePasswordErrorAxios && getFieldError(changePasswordErrorAxios, "currentPassword")}
        labelProps={{ htmlFor: "currentPassword" }}
        inputProps={{ id: "currentPassword", name: "currentPassword", placeholder: "Current Password", required: true }}
      />

      <InputPassword
        errorMessage={changePasswordErrorAxios && getFieldError(changePasswordErrorAxios, "password")}
        labelProps={{ htmlFor: "password" }}
        inputProps={{ id: "password", name: "password", placeholder: "New Password", required: true }}
      />

      <InputPassword
        errorMessage={changePasswordErrorAxios && getFieldError(changePasswordErrorAxios, "confirmPassword")}
        labelProps={{ htmlFor: "confirmPassword" }}
        inputProps={{
          id: "confirmPassword",
          name: "confirmPassword",
          placeholder: "Confirm New Password",
          required: true,
        }}
      />

      <Button
        variant="info"
        className="w-full font-bold"
        isLoading={isButtonSubmitLoading}
        disabled={isButtonSubmitLoading}
      >
        Edit Password
      </Button>
    </Form>
  );
}
