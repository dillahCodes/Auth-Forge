export enum ApiRouters {
  // AUTH
  LOGIN = "/api/auth/login",
  LOGOUT = "/api/auth/logout",
  ME = "/api/auth/me",
  REGISTER = "/api/auth/register",

  // SESSIONS
  SESSIONS = "/api/auth/sessions",
  SESSIONS_REFRESH = "/api/auth/sessions/refresh",
  SESSIONS_REVOKE = "/api/auth/sessions/revoke",
  SESSIONS_REVOKE_BYID = "/api/auth/sessions/:sessionId",
  SESSION_COUNT = "/api/auth/sessions/count",

  // USERS
  USERS_BYID = "/api/users/:userId",

  // 2FA
  TWOFA_SEND = "/api/auth/2fa/send",
  TWOFA_VERIFY = "/api/auth/2fa/verify",

  // CHANGE PROFILE EMAIL
  CHANGE_EMAIL_CANCEL = "/api/auth/change-profile/email/cancel",
  CHANGE_EMAIL_REQUEST = "/api/auth/change-profile/email/request",
  CHANGE_EMAIL_UPDATE = "/api/auth/change-profile/email/update",
  CHANGE_EMAIL_VERIFICATION_SEND = "/api/auth/change-profile/email/verification/send",
  CHANGE_EMAIL_VERIFICATION_VERIFY = "/api/auth/change-profile/email/verification/verify",

  // CHANGE PROFILE NAME
  CHANGE_NAME = "/api/auth/change-profile/name",

  // CHANGE PROFILE PASSWORD
  CHANGE_PASSWORD = "/api/auth/change-profile/password",

  // EMAIL VERIFICATION
  EMAIL_VERIFICATION_SEND = "/api/auth/email/send",
  EMAIL_VERIFICATION_VERIFY = "/api/auth/email/verify",

  // FORGOT PASSWORD
  FORGOT_PASSWORD_SEND = "/api/auth/forgot-password/send",
  FORGOT_PASSWORD_VERIFY = "/api/auth/forgot-password/verify",

  // REVERT ACCOUNT
  REVERT_ACCOUNT_EMAIL_CHANGE = "/api/auth/revert-account/email-change",
  REVERT_ACCOUNT_PASSWORD_CHANGE = "/api/auth/revert-account/password-change",
}
