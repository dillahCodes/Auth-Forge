import "server-only";
import { ServiceUnavailable } from "@/shared/errors/resource-error";
import { Resend } from "resend";
import { VerifyEmailTemplate } from "../components/template/verify-email.template";
import { PasswordResetVerifyTemplate } from "../components/template/password-reset-verify.template";
import { ForgotPasswordRevertTemplate } from "../components/template/password-change-revert.template";

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
      subject: "AuthForge Password Reset",
      react: ForgotPasswordRevertTemplate({ name, url }),
    });
  },
};
