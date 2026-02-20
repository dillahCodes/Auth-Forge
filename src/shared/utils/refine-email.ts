import { ALLOWED_EMAIL_DOMAINS } from "@/features/auth/constant/email.constant";

export function refineEmailDomain(email: string) {
  const domain = email.split("@")[1];
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}

const EMAIL_RULES = {
  LOCAL_MIN_LENGTH: 3,
  LOCAL_MAX_LENGTH: 40,
  MAX_CONSECUTIVE_REPEATS: 4,
  MAX_DOT_COUNT: 3,
} as const;

const refineEmailHumanLikeHelpers = {
  containsLetter(value: string) {
    return /[a-zA-Z]/.test(value);
  },

  containsValidCharacters(value: string) {
    return /^[a-zA-Z0-9._-]+$/.test(value);
  },

  hasTooManyRepeatingCharacters(value: string) {
    const pattern = new RegExp(`(.)\\1{${EMAIL_RULES.MAX_CONSECUTIVE_REPEATS},}`);
    return pattern.test(value);
  },

  hasTooManyDots(value: string) {
    const dotCount = value.match(/\./g)?.length ?? 0;
    return dotCount > EMAIL_RULES.MAX_DOT_COUNT;
  },
};

export function refineEmailHumanLike(email: string) {
  const [local] = email.split("@");

  if (!local) return false;

  if (local.length < EMAIL_RULES.LOCAL_MIN_LENGTH) return false;
  if (local.length > EMAIL_RULES.LOCAL_MAX_LENGTH) return false;

  if (!refineEmailHumanLikeHelpers.containsLetter(local)) return false;
  if (!refineEmailHumanLikeHelpers.containsValidCharacters(local)) return false;
  if (refineEmailHumanLikeHelpers.hasTooManyRepeatingCharacters(local)) return false;
  if (refineEmailHumanLikeHelpers.hasTooManyDots(local)) return false;

  return true;
}
