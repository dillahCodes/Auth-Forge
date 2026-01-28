import "server-only";
import { ServiceUnavailable } from "@/shared/errors/resource-error";
import { Resend } from "resend";
import { VerifyEmailTemplate } from "../components/verify-email-template";
import { VerifyResetPasswordTemplate } from "../components/verify-reset-password-tamplate";

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

// DOC: low-level email sender (private helper)
async function sendEmail({ to, subject, react }: SendEmailParams) {
  const { error } = await resend.emails.send({
    from: `noreply <noreply@${process.env.RESEND_DOMAIN}>`,
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
      subject: "Email Verification Code",
      react: VerifyEmailTemplate({ name, otp }),
    });
  },

  // DOC: Send reset password email
  async sendResetPasswordEmail({ name, email, url }: SendResetPasswordEmailParams) {
    return sendEmail({
      to: email,
      subject: "Reset Password",
      react: VerifyResetPasswordTemplate({ name, url }),
    });
  },
};
