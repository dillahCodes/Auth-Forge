import { Button } from "@/shared/components/ui/button";
import { IconWithText } from "@/shared/components/ui/icon-text";
import { Activity, useEffect, useEffectEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthProvider } from "../../../../../../prisma/generated/enums";
import { useTwoFaStatus } from "@/features/auth/hooks/use-2fa-status";
import { TwoFaConfig, useTwoFaModal } from "@/shared/components/ui/modal/modal-2fa";
import { StatusTwoFaToken } from "@/features/auth/types/2fa";
import { useAuthGoogleConnect } from "@/features/auth/hooks/auth-google/use-auth-google-connect";

interface EditProviderGoogleProps {
  isConnected: boolean;
  currentProviderName: AuthProvider;
  isOnlyOneProvider?: boolean;
  userEmail?: string;
}

const TWO_VERIFICATION_CONFIG: TwoFaConfig = { timeoutSeconds: 120, featureKey: "2fa-edit-google", otpLength: 6 };

export default function EditProviderGoogle({
  isConnected,
  isOnlyOneProvider,
  currentProviderName,
  userEmail,
}: EditProviderGoogleProps) {
  const email = userEmail as string;

  const twoFaModal = useTwoFaModal();
  const { data: twoFaStatusData, mutateAsync: twoFaStatusMutate, isPending: isTwoFaStatusPending } = useTwoFaStatus();
  const { mutate: connectWithGoogle, isPending: isConnectPending } = useAuthGoogleConnect();

  const isButtonSubmitLoading = isTwoFaStatusPending || isConnectPending;

  const handleReqtwoFaStatus = async () => {
    await twoFaStatusMutate({ scope: "TOGGLE_GOOGLE_CONNECTION" });
  };

  // DOC: handle toggle bind unbind
  const handleToggleBindUnbindWithoutTwoFa = () => {
    connectWithGoogle();
  };

  const handleToggleBindUnbindWithTwoFa = () => {
    twoFaModal.open({
      config: TWO_VERIFICATION_CONFIG,
      sendToEmail: email,
      scope: "TOGGLE_GOOGLE_CONNECTION",
      afterVerify() {
        connectWithGoogle();
      },
    });
  };

  // DOC: open modal or directly send request connect based on 2fa status
  const handleTwoFaDecision = useEffectEvent((StatusTwoFa: StatusTwoFaToken) => {
    const openModalConditions = [StatusTwoFaToken.INVALID_SCOPE, StatusTwoFaToken.MISSING];
    const shouldOpenModal = openModalConditions.includes(StatusTwoFa);

    if (shouldOpenModal) handleToggleBindUnbindWithTwoFa();

    const sendRequestChangeCondition = [StatusTwoFaToken.AVAILABLE];
    const shouldSendRequest = sendRequestChangeCondition.includes(StatusTwoFa);

    if (shouldSendRequest) handleToggleBindUnbindWithoutTwoFa();
  });

  // DOC: open modal or directly send request connect based on 2fa status
  useEffect(() => {
    if (!twoFaStatusData) return;
    const StatusTwoFa = twoFaStatusData.data?.status as StatusTwoFaToken;

    handleTwoFaDecision(StatusTwoFa);
  }, [twoFaStatusData]);

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-4 flex-2">
        <IconWithText
          wrapperProps={{ className: "gap-4" }}
          icon={FcGoogle}
          text={isConnected ? "Connected with Google" : "Connect With Google"}
        />
      </div>

      <div className="flex items-center gap-4 flex-1">
        <Activity mode={currentProviderName === AuthProvider.GOOGLE ? "hidden" : "visible"}>
          <Activity name="ConnectGoogle" mode={isConnected ? "hidden" : "visible"}>
            <Button
              variant="info"
              className="font-bold w-full"
              disabled={isButtonSubmitLoading}
              isLoading={isButtonSubmitLoading}
              onClick={handleReqtwoFaStatus}
            >
              Connect
            </Button>
          </Activity>

          <Activity name="DisconnectGoogle" mode={isConnected ? "visible" : "hidden"}>
            <Button
              variant="danger"
              className="font-bold w-full"
              disabled={isOnlyOneProvider || isButtonSubmitLoading}
              isLoading={isButtonSubmitLoading}
              onClick={handleReqtwoFaStatus}
            >
              Disconnect
            </Button>
          </Activity>
        </Activity>

        <Activity mode={currentProviderName === AuthProvider.GOOGLE ? "visible" : "hidden"}>
          <Button variant="text" className="font-bold w-full" disabled>
            Connected
          </Button>
        </Activity>
      </div>
    </div>
  );
}
