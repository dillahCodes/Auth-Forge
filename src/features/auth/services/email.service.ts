import { ServiceUnavailable } from "@/shared/errors/resource-error";
import { Resend } from "resend";
import "server-only";
import { TwoFactorEmailTemplate } from "../components/template/2fa.template";
import { PasswordChangeRevertTemplate } from "../components/template/password-change-revert.template";
import { PasswordResetVerifyTemplate } from "../components/template/password-reset-verify.template";
import { VerifyEmailTemplate } from "../components/template/verify-email.template";
import { EmailChangeRevertTemplate } from "../components/template/email-change-revert.template";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

interface SendVerifyEmailParams {
  name: string;
  email: string;
  otp: string;
}

interface SendResetPasswordEmailParams {
  name: string;
  email: string;
  url: string;
}

interface SendPasswordResetEmailRevertParams {
  name: string;
  email: string;
  url: string;
}

interface TwoFactorEmailTemplateProps {
  email: string;
  name: string;
  otp: string;
  location: string;
}

interface SendRevertAccountEmailParams {
  name: string;
  url: string;
  email: string;
  newEmail: string;
}

// DOC: low-level email sender (private helper)
async function sendEmail({ to, subject, react }: SendEmailParams) {
  const { error } = await resend.emails.send({
    from: `noreply <no-reply@${process.env.RESEND_DOMAIN}>`,
    to: [to],
    subject,
    react,
  });

  if (error) throw new ServiceUnavailable("Failed to send email");
}

export const EmailService = {
  // DOC: Send email verification OTP
  async sendVerifyEmail({ name, email, otp }: SendVerifyEmailParams) {
    return sendEmail({
      to: email,
      subject: "AuthForge Email Verification Code",
      react: VerifyEmailTemplate({ name, otp }),
    });
  },

  // DOC: Send reset password email
  async sendResetPasswordEmail({ name, email, url }: SendResetPasswordEmailParams) {
    return sendEmail({
      to: email,
      subject: "AuthForge Reset Password Request",
      react: PasswordResetVerifyTemplate({ name, url }),
    });
  },

  // DOC: Send password reset email revert, triggered when password has been reset,
  //      from the password reset page or from the forgot password page
  async sendPasswordResetEmailRevert({ email, name, url }: SendPasswordResetEmailRevertParams) {
    return sendEmail({
      to: email,
      subject: "AuthForge Password Change",
      react: PasswordChangeRevertTemplate({ name, url }),
    });
  },

  // DOC: Send revert account email
  async sendEmailChangeRevert({ name, url, email, newEmail }: SendRevertAccountEmailParams) {
    return sendEmail({
      to: email,
      subject: "AuthForge Email Change",
      react: EmailChangeRevertTemplate({ name, url, oldEmail: email, newEmail }),
    });
  },

  // DOC: Send 2FA email
  async sendTwoFactorEmail({ name, otp, location, email }: TwoFactorEmailTemplateProps) {
    return sendEmail({
      to: email,
      subject: `AuthForge 2-Step Verification: ${name}`,
      react: TwoFactorEmailTemplate({ username: name, otp, location }),
    });
  },
};
