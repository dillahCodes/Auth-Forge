import { useTwoFaStatus } from "@/features/auth/hooks/use-2fa-status";
import { StatusTwoFaToken } from "@/features/auth/types/2fa";
import { StatusBadge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form/form";
import { IconWithText } from "@/shared/components/ui/icon-text";
import { InputEmail } from "@/shared/components/ui/input/input-email";
import { MessageBox } from "@/shared/components/ui/messagebox";
import { useModal } from "@/shared/components/ui/modal/modal";
import { TwoFaConfig, useTwoFaModal } from "@/shared/components/ui/modal/modal-2fa";
import { BuildError, useBuildAxiosError } from "@/shared/hooks/use-build-axios-erros";
import { ApiResponse } from "@/shared/types/response";
import { getFieldError } from "@/shared/utils/response-helper";
import { AxiosError } from "axios";
import { Activity, useEffect, useEffectEvent, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { EmailChangeRequest } from "../../../../../../prisma/generated/client";
import { useChangeEmailCancel } from "../../../hooks/use-change-email-cancel";
import { useChangeEmailRequest } from "../../../hooks/use-change-email-request";
import { useChangeEmailUpdate } from "../../../hooks/use-change-email-update";
import { ChangeEmailSchema, ChangeEmailUpdateSchema } from "../../../schemas/account.schema";
import { useVerifyChangeEmailModal, VerifyChangeEmailConfig } from "../../modal/edit-email-verify.modal";

interface ChangeEmailProps {
  defaultEmail?: string;
  pendingEmailChange?: EmailChangeRequest | null;
}

type FormMode = "PENDING" | "EDIT" | "PENDING_UPDATE";

type formdataEntries = {
  [k: string]: FormDataEntryValue;
} | null;

const TWO_VERIFICATION_CONFIG: TwoFaConfig = { timeoutSeconds: 120, featureKey: "2fa-edit-email", otpLength: 6 };
const CHANGE_EMAIL_CONFIG: VerifyChangeEmailConfig = {
  timeoutSeconds: 120,
  featureKey: "change-email",
  otpLength: 6,
};

export default function EditEmail({ defaultEmail, pendingEmailChange }: ChangeEmailProps) {
  const email = defaultEmail as string;
  const [formMode, setFormMode] = useState<FormMode>("EDIT");
  const [formdataEntries, setFormDataEntries] = useState<formdataEntries>(null);

  const modal = useModal();
  const twoFaModal = useTwoFaModal();
  const verifyChangeEmailModal = useVerifyChangeEmailModal();

  const { data: twoFaStatusData, mutate: twoFaStatusMutate, isPending: isTwoFaStatusPending } = useTwoFaStatus();

  const {
    mutate: requestChangeEmail,
    status: statusRequestChangeEmail,
    data: dataRequestChangeEmail,
    reset: resetRequestChangeEmail,
    error: errorRequestChangeEmail,
    isPending: isRequestPendingChangeEmail,
  } = useChangeEmailRequest();

  const {
    mutateAsync: updateChangeEmail,
    status: statusUpdateChangeEmail,
    data: dataUpdateChangeEmail,
    reset: resetUpdateChangeEmail,
    error: errorUpdateChangeEmail,
    isPending: isUpdatePendingChangeEmail,
  } = useChangeEmailUpdate();

  const {
    mutateAsync: cancelChangeEmail,
    status: statusCancelChangeEmail,
    data: dataCancelChangeEmail,
    reset: resetCancelChangeEmail,
    error: errorCancelChangeEmail,
    isPending: isCancelPendingChangeEmail,
  } = useChangeEmailCancel();

  const isFormEditAndPendingUpdateLoading = [
    isRequestPendingChangeEmail,
    isUpdatePendingChangeEmail,
    isTwoFaStatusPending,
  ].some(Boolean);

  const axiosErrorRequestChangeEmail = errorRequestChangeEmail as AxiosError<ApiResponse>;
  const axiosErrorUpdateChangeEmail = errorUpdateChangeEmail as AxiosError<ApiResponse>;
  const axiosErrorCancelChangeEmail = errorCancelChangeEmail as AxiosError<ApiResponse>;

  // DOC: error message handler
  const requestChangeEmailFlows: BuildError[] = [
    { data: dataRequestChangeEmail, error: axiosErrorRequestChangeEmail, status: statusRequestChangeEmail },
    { data: dataUpdateChangeEmail, error: axiosErrorUpdateChangeEmail, status: statusUpdateChangeEmail },
    { data: dataCancelChangeEmail, error: axiosErrorCancelChangeEmail, status: statusCancelChangeEmail },
  ];

  // DOC: reset state handler
  const resetState = [resetRequestChangeEmail, resetUpdateChangeEmail, resetCancelChangeEmail];
  const requestChangeEmailMessage = useBuildAxiosError({ errors: requestChangeEmailFlows, resetState });

  // DOC: handle form mode
  //     - PENDING: show pending email change
  //     - PENDING_UPDATE: show pending email change
  //     - EDIT: show edit email form
  const handleFormMode = useEffectEvent((mode: FormMode) => {
    setFormMode(mode);
  });

  // DOC: handle request update email
  //      - send request to change email and show pending email change
  const handleRequestChangeEmail = () => {
    const payloadEmailChange = { ...formdataEntries, email } as ChangeEmailSchema;
    requestChangeEmail(payloadEmailChange);
  };

  // DOC: handle update requested email
  //      - send request to update pending email
  const handleUpdateRequestedEmail = async () => {
    const payloadEmailChange = { ...formdataEntries, requestId: pendingEmailChange?.id } as ChangeEmailUpdateSchema;
    await updateChangeEmail(payloadEmailChange);
    setFormMode("PENDING");
  };

  // DOC: handle cancel change email
  //      - send request to cancel pending email
  const handleCancelChangeEmail = () => {
    modal.open({
      title: "Cancel Email Change",
      content: "Are you sure you want to cancel your email change request?",
      onConfirm: async () => {
        await cancelChangeEmail();
        setFormMode("EDIT");
      },
    });
  };

  // DOC: handle send verification to new email
  const handleVerifyNewEmail = async () => {
    const newEmail: string = pendingEmailChange?.newEmail as string;
    verifyChangeEmailModal.open({ config: CHANGE_EMAIL_CONFIG, sendToEmail: newEmail });
  };

  // DOC: handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setFormDataEntries(data);
  };

  // DOC: handle form mode decision
  const handleFormModeDecision = useEffectEvent(() => {
    if (formMode.includes("PENDING_UPDATE")) {
      modal.open({
        title: "Update Pending Email Change",
        content: "Are you sure you want to update your pending email change?",
        onConfirm: async () => {
          await handleUpdateRequestedEmail();
        },
      });
      return;
    }

    if (formMode.includes("EDIT")) {
      twoFaStatusMutate({ scope: "CHANGE_EMAIL" });
      return;
    }
  });

  // DOC: handle open two fa modal
  const handleOpenTwoFaModal = useEffectEvent(() => {
    if (formMode.includes("EDIT")) {
      twoFaModal.open({
        config: TWO_VERIFICATION_CONFIG,
        sendToEmail: email,
        scope: "CHANGE_EMAIL",
        afterVerify() {
          handleRequestChangeEmail();
        },
      });
    }
  });

  // DOC: handle direct update or request email change
  //      - if form mode is EDIT, request change email
  //      - if form mode is PENDING_UPDATE, update pending email
  const handleDirectUpdateOrRequestEmailChange = useEffectEvent(() => {
    formMode.includes("EDIT") && handleRequestChangeEmail();
    formMode.includes("PENDING_UPDATE") && handleUpdateRequestedEmail();
  });

  // DOC: effects handle form decision when form data is available
  useEffect(() => {
    if (formdataEntries) handleFormModeDecision();
  }, [formdataEntries]);

  // DOC: open modal or directly send request email change based on 2fa status
  useEffect(() => {
    if (!twoFaStatusData) return;
    const StatusTwoFa = twoFaStatusData.data?.status as StatusTwoFaToken;

    const openModalConditions = [StatusTwoFaToken.INVALID_SCOPE, StatusTwoFaToken.MISSING];
    const shouldOpenModal = openModalConditions.includes(StatusTwoFa);

    if (shouldOpenModal) handleOpenTwoFaModal();

    const sendRequestChangeCondition = [StatusTwoFaToken.AVAILABLE];
    const shouldSendRequest = sendRequestChangeCondition.includes(StatusTwoFa);
    if (shouldSendRequest) handleDirectUpdateOrRequestEmailChange();
  }, [twoFaStatusData]);

  // DOC: effects handle form mode
  useEffect(() => {
    if (pendingEmailChange) handleFormMode("PENDING");
    if (!pendingEmailChange) handleFormMode("EDIT");
  }, [pendingEmailChange]);

  return (
    <Form className="p-4!" onSubmit={handleSubmit}>
      <h2 className="font-bold mb-2">Email</h2>

      {/* message box */}
      <Activity mode={requestChangeEmailMessage ? "visible" : "hidden"}>
        <MessageBox type={requestChangeEmailMessage?.type as "success" | "error"}>
          {requestChangeEmailMessage?.message}
        </MessageBox>
      </Activity>

      {/* current email with status */}
      <div className="flex gap-4 items-center">
        <IconWithText icon={MdOutlineEmail} text={defaultEmail} />
        <StatusBadge status="verified" />
      </div>

      {/* new email with status */}
      <Activity name="cancel email change" mode={["PENDING"].includes(formMode) ? "visible" : "hidden"}>
        <div className="flex gap-4 items-center">
          <IconWithText icon={MdOutlineEmail} text={pendingEmailChange?.newEmail} />
          <StatusBadge status="pending" />

          <Button
            iconRight={<BsPencilSquare />}
            onClick={() => setFormMode("PENDING_UPDATE")}
            type="button"
            variant="text"
            className="underline font-semibold"
          >
            Update
          </Button>
        </div>

        {/* verify new email and cancel change email button */}
        <div className="w-full grid grid-cols-2 gap-4">
          <Button
            variant="danger"
            type="button"
            isLoading={isCancelPendingChangeEmail}
            className="font-bold"
            onClick={handleCancelChangeEmail}
          >
            Cancel
          </Button>
          <Button
            variant="info"
            type="button"
            disabled={isCancelPendingChangeEmail}
            className="font-bold"
            onClick={handleVerifyNewEmail}
          >
            Verify
          </Button>
        </div>
      </Activity>

      {/* input new email and edit pending email */}
      <Activity name="input new email" mode={["EDIT", "PENDING_UPDATE"].includes(formMode) ? "visible" : "hidden"}>
        <div className="flex gap-4">
          <InputEmail
            errorMessage={axiosErrorRequestChangeEmail && getFieldError(axiosErrorRequestChangeEmail, "newEmail")}
            labelProps={{ htmlFor: "newEmail" }}
            inputProps={{ id: "newEmail", name: "newEmail", placeholder: "New Email", required: true }}
          />
        </div>

        <Button
          isLoading={isFormEditAndPendingUpdateLoading}
          disabled={isFormEditAndPendingUpdateLoading}
          variant="info"
          type="submit"
          className="w-full font-bold disabled:opacity-50"
        >
          Edit Email
        </Button>
      </Activity>
    </Form>
  );
}
