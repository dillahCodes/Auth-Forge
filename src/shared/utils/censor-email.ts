export function censorEmail(email: string) {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];

  return `${firstChar}.....${lastChar}@${domain}`;
}
