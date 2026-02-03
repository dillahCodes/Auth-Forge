import { ALLOWED_EMAIL_DOMAINS } from "@/features/auth/constant/email.constant";

export function refineEmail(email: string) {
  const domain = email.split("@")[1];
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}
