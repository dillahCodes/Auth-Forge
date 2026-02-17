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
import { useChangeEmailCancel } from "../../../hooks/use-change-email-cancel";
import { useChangeEmailRequest } from "../../../hooks/use-change-email-request";
import { useChangeEmailUpdate } from "../../../hooks/use-change-email-update";
import { ChangeEmailSchema, ChangeEmailUpdateSchema } from "../../../schemas/account.schema";
import { useVerifyChangeEmailModal, VerifyChangeEmailConfig } from "../../modal/edit-email-verify.modal";
import { EmailChangeRequest } from "../../../../../../prisma/generated/client";

interface ChangeEmailProps {
  defaultEmail?: string;
  pendingEmailChange?: EmailChangeRequest | null;
}

type FormMode = "PENDING" | "EDIT" | "PENDING_UPDATE";

const TWO_VERIFICATION_CONFIG: TwoFaConfig = { timeoutSeconds: 120, featureKey: "2fa-edit-email", otpLength: 6 };
const CHANGE_EMAIL_CONFIG: VerifyChangeEmailConfig = {
  timeoutSeconds: 120,
  featureKey: "change-email",
  otpLength: 6,
};

export default function EditEmail({ defaultEmail, pendingEmailChange }: ChangeEmailProps) {
  const email = defaultEmail as string;

  const modal = useModal();
  const twoFaModal = useTwoFaModal();
  const verifyChangeEmailModal = useVerifyChangeEmailModal();

  const [formMode, setFormMode] = useState<FormMode>("EDIT");

  const {
    mutate: requestChangeEmail,
    status: statusRequestChangeEmail,
    data: dataRequestChangeEmail,
    reset: resetRequestChangeEmail,
    error: errorRequestChangeEmail,
  } = useChangeEmailRequest();

  const {
    mutateAsync: updateChangeEmail,
    status: statusUpdateChangeEmail,
    data: dataUpdateChangeEmail,
    reset: resetUpdateChangeEmail,
    error: errorUpdateChangeEmail,
  } = useChangeEmailUpdate();

  const {
    mutateAsync: cancelChangeEmail,
    status: statusCancelChangeEmail,
    data: dataCancelChangeEmail,
    reset: resetCancelChangeEmail,
    error: errorCancelChangeEmail,
  } = useChangeEmailCancel();

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
  const handleFormMode = useEffectEvent((mode: FormMode) => {
    setFormMode(mode);
  });

  // DOC: handle request update email
  const handleRequestChangeEmail = (formdata: FormData) => {
    const payloadEmailChange = { ...Object.fromEntries(formdata.entries()), email } as ChangeEmailSchema;
    requestChangeEmail(payloadEmailChange);
  };

  // DOC: handle update requested email
  const handleUpdateRequestedEmail = async (formData: FormData) => {
    const formdataEntries = Object.fromEntries(formData.entries());
    const payloadEmailChange = { ...formdataEntries, requestId: pendingEmailChange?.id } as ChangeEmailUpdateSchema;

    await updateChangeEmail(payloadEmailChange);
    setFormMode("PENDING");
  };

  // DOC: handle cancel change email
  const handleChangeEmailCancel = () => {
    modal.open({
      title: "Cancel Email Change",
      content: "Are you sure you want to cancel your email change request?",
      onConfirm: async () => {
        await cancelChangeEmail();
        setFormMode("EDIT");
      },
    });
  };

  // DOC: handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailFormData = new FormData(e.currentTarget);
    const newEmail = emailFormData.get("newEmail")?.toString().trim();

    if (!newEmail) return;

    twoFaModal.open({
      config: TWO_VERIFICATION_CONFIG,
      sendToEmail: email,
      scope: "CHANGE_EMAIL",
      afterVerify() {
        formMode.includes("PENDING_UPDATE")
          ? handleUpdateRequestedEmail(emailFormData)
          : handleRequestChangeEmail(emailFormData);
      },
    });
  };

  // DOC: handle send verification email
  const handleSendVerificationEmail = async () => {
    const newEmail: string = pendingEmailChange?.newEmail as string;
    verifyChangeEmailModal.open({ config: CHANGE_EMAIL_CONFIG, sendToEmail: newEmail });
  };

  // DOC: effects handle form mode
  useEffect(() => {
    if (pendingEmailChange) handleFormMode("PENDING");
    if (!pendingEmailChange) handleFormMode("EDIT");
  }, [pendingEmailChange]);

  return (
    <Form className="p-4!" onSubmit={handleSubmit}>
      <h2 className="font-bold mb-2">Email</h2>

      <Activity mode={requestChangeEmailMessage ? "visible" : "hidden"}>
        <MessageBox type={requestChangeEmailMessage?.type as "success" | "error"}>
          {requestChangeEmailMessage?.message}
        </MessageBox>
      </Activity>

      <div className="flex gap-4 items-center">
        <IconWithText icon={MdOutlineEmail} text={defaultEmail} />
        <StatusBadge status="verified" />
      </div>

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

        <div className="w-full grid grid-cols-2 gap-4">
          <Button variant="danger" type="button" className="font-bold" onClick={handleChangeEmailCancel}>
            Cancel
          </Button>
          <Button variant="info" type="button" className=" font-bold" onClick={handleSendVerificationEmail}>
            Verify
          </Button>
        </div>
      </Activity>

      <Activity name="input new email" mode={["EDIT", "PENDING_UPDATE"].includes(formMode) ? "visible" : "hidden"}>
        <div className="flex gap-4">
          <InputEmail
            errorMessage={axiosErrorRequestChangeEmail && getFieldError(axiosErrorRequestChangeEmail, "newEmail")}
            labelProps={{ htmlFor: "newEmail" }}
            inputProps={{ id: "newEmail", name: "newEmail", placeholder: "New Email", required: true }}
          />
        </div>

        <Button variant="info" type="submit" className="w-full font-bold disabled:opacity-50">
          Edit Email
        </Button>
      </Activity>
    </Form>
  );
}
