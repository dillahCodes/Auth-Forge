import { useTwoFaStatus } from "@/features/auth/hooks/use-2fa-status";
import { useAuthCredentialsConnect } from "@/features/auth/hooks/use-auth-credentials-connect";
import { ConnectCredentialsSchema } from "@/features/auth/schemas/auth-credentials.schema";
import { StatusTwoFaToken } from "@/features/auth/types/2fa";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { IconWithText } from "@/shared/components/ui/icon-text";
import { InputPassword } from "@/shared/components/ui/input/input-password";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { TwoFaConfig, useTwoFaModal } from "@/shared/components/ui/modal/modal-2fa";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity, Fragment, useEffect, useEffectEvent, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { AuthProvider } from "../../../../../../prisma/generated/enums";

interface EditProviderCredentialsProps {
  isConnected: boolean;
  currentProviderName: string;
  isOnlyOneProvider?: boolean;
  userEmail?: string;
}

type FormDataConnectCredentials = ConnectCredentialsSchema | null;

const TWO_VERIFICATION_CONFIG: TwoFaConfig = { timeoutSeconds: 120, featureKey: "2fa-edit-credentials", otpLength: 6 };

export default function EditProviderCredentials({
  isConnected,
  isOnlyOneProvider,
  currentProviderName,
  userEmail,
}: EditProviderCredentialsProps) {
  const email = userEmail as string;
  const isCredentialsProvider = currentProviderName === AuthProvider.CREDENTIALS;

  const [formData, setFormData] = useState<FormDataConnectCredentials>(null);
  const [isFormBindVisible, setIsFormBindVisible] = useState(false);

  const twoFaModal = useTwoFaModal();

  const {
    mutate: credentialsConnect,
    error: credentialsConnectError,
    isPending: isCredentialsPending,
    data: credentialsConnectData,
    status: credentialsConnectStatus,
    reset: credentialsConnectReset,
  } = useAuthCredentialsConnect({ onSuccessParams: () => setIsFormBindVisible(false) });

  const { data: twoFaStatusData, mutateAsync: twoFaStatusMutate, isPending: isTwoFaStatusPending } = useTwoFaStatus();

  const credentialsAxiosError = credentialsConnectError as AxiosError<ApiResponse>;
  const isCredentialsPendingConnect = isCredentialsPending || isTwoFaStatusPending;

  // DOC: error message handling
  const flows: BuildError[] = [
    { data: credentialsConnectData, error: credentialsAxiosError, status: credentialsConnectStatus },
  ];

  const message = useBuildAxiosError({ errors: flows, resetState: [credentialsConnectReset] });

  // DOC: handle form toggle
  const handleToggleFormBind = () => setIsFormBindVisible((prev) => !prev);

  // DOC: handle unbind
  const handleUnbind = async () => await twoFaStatusMutate({ scope: "TOGGLE_CREDENTIALS_CONNECTION" });

  const handleUnbindWithoutTwoFa = useEffectEvent(() => {
    credentialsConnect({ mode: "UNBIND" });
  });

  const handleUnbindWithTwoFa = useEffectEvent(() => {
    twoFaModal.open({
      config: TWO_VERIFICATION_CONFIG,
      sendToEmail: email,
      scope: "TOGGLE_CREDENTIALS_CONNECTION",
      afterVerify() {
        credentialsConnect({ mode: "UNBIND" });
      },
    });
  });

  // DOC: handle bind
  const handleBind = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as ConnectCredentialsSchema;
    setFormData(data);

    await twoFaStatusMutate({ scope: "TOGGLE_CREDENTIALS_CONNECTION" });
  };

  const handleBindWithoutTwoFa = useEffectEvent(() => {
    if (!formData) return;
    credentialsConnect({ ...formData, mode: "BIND" });
  });

  // DOC: handle bind with 2fa
  const handleBindWithTwoFa = useEffectEvent(() => {
    if (!formData) return;

    twoFaModal.open({
      config: TWO_VERIFICATION_CONFIG,
      sendToEmail: email,
      scope: "TOGGLE_CREDENTIALS_CONNECTION",
      afterVerify() {
        credentialsConnect({ ...formData, mode: "BIND" });
      },
    });
  });

  // DOC: open modal or directly send request connect based on 2fa status
  const handleTwoFaDecision = useEffectEvent((StatusTwoFa: StatusTwoFaToken) => {
    const openModalConditions = [StatusTwoFaToken.INVALID_SCOPE, StatusTwoFaToken.MISSING];
    const shouldOpenModal = openModalConditions.includes(StatusTwoFa);

    if (shouldOpenModal) isConnected ? handleUnbindWithTwoFa() : handleBindWithTwoFa();

    const sendRequestChangeCondition = [StatusTwoFaToken.AVAILABLE];
    const shouldSendRequest = sendRequestChangeCondition.includes(StatusTwoFa);

    if (shouldSendRequest) isConnected ? handleUnbindWithoutTwoFa() : handleBindWithoutTwoFa();
  });

  // DOC: open modal or directly send request connect based on 2fa status
  useEffect(() => {
    if (!twoFaStatusData) return;
    const StatusTwoFa = twoFaStatusData.data?.status as StatusTwoFaToken;

    handleTwoFaDecision(StatusTwoFa);
  }, [twoFaStatusData]);

  return (
    <Fragment>
      <Activity mode={message ? "visible" : "hidden"}>
        <MessageBox type={message?.type as "success" | "error"}>{message?.message}</MessageBox>
      </Activity>

      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4 flex-2">
          <IconWithText
            wrapperProps={{ className: "gap-4" }}
            icon={IoKeyOutline}
            text={isConnected ? "Connected With Credentials" : "Connect With Credentials"}
          />
        </div>

        <div className="flex items-center gap-4 flex-1">
          <Activity mode={!isCredentialsProvider ? "visible" : "hidden"}>
            <Activity name="ConnectCredentials" mode={!isConnected && !isFormBindVisible ? "visible" : "hidden"}>
              <Button variant="info" className="font-bold w-full" onClick={handleToggleFormBind}>
                Connect
              </Button>
            </Activity>

            <Activity mode={!isConnected && isFormBindVisible ? "visible" : "hidden"}>
              <Button variant="danger" className="font-bold w-full" onClick={handleToggleFormBind}>
                Cancel
              </Button>
            </Activity>

            <Activity name="DisconnectCredentials" mode={isConnected ? "visible" : "hidden"}>
              <Button
                variant="danger"
                className="font-bold w-full"
                disabled={isOnlyOneProvider || isCredentialsPendingConnect}
                isLoading={isCredentialsPendingConnect}
                onClick={handleUnbind}
              >
                Disconnect
              </Button>
            </Activity>
          </Activity>

          <Activity mode={isCredentialsProvider ? "visible" : "hidden"}>
            <Button variant="text" className="font-bold w-full" disabled>
              Connected
            </Button>
          </Activity>
        </div>
      </div>

      <Activity name="credentials form" mode={isFormBindVisible && !isConnected ? "visible" : "hidden"}>
        <Form variant="ghost" onSubmit={handleBind}>
          <InputPassword
            errorMessage={credentialsAxiosError && getFieldError(credentialsAxiosError, "password")}
            labelProps={{ htmlFor: "password" }}
            inputProps={{ id: "password", name: "password", placeholder: "Password" }}
          />

          <InputPassword
            errorMessage={credentialsAxiosError && getFieldError(credentialsAxiosError, "confirmPassword")}
            labelProps={{ htmlFor: "confirmPassword" }}
            inputProps={{ id: "confirmPassword", name: "confirmPassword", placeholder: "Confirm Password" }}
          />

          <Button
            type="submit"
            variant="info"
            className="font-semibold"
            disabled={isCredentialsPendingConnect}
            isLoading={isCredentialsPendingConnect}
          >
            Connect
          </Button>
        </Form>
      </Activity>
    </Fragment>
  );
}
