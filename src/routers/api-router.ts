export enum ApiRouters {
  ME = "/api/auth/me",

  // GOOGLE
  AUTH_GOOGLE = "/api/auth/providers/account/google",
  AUTH_GOOGLE_CONNECT = "/api/auth/providers/connection/google",

  // CREDENTIALS
  AUTH_CREDENTIALS_LOGIN = "/api/auth/providers/account/credentials/login",
  AUTH_CREDENTIALS_REGISTER = "/api/auth/providers/account/credentials/register",
  AUTH_CREDENTIALS_CONNECT = "/api/auth/providers/connection/credentials",

  // LOGOUT
  LOGOUT = "/api/auth/providers/account/logout",

  // SESSIONS
  SESSIONS = "/api/auth/sessions",
  SESSIONS_REFRESH = "/api/auth/sessions/refresh",
  SESSION_COUNT = "/api/auth/sessions/count",
  SESSIONS_REVOKE = "/api/auth/sessions/revoke",
  SESSIONS_REVOKE_BYID = "/api/auth/sessions/:sessionId",

  // 2FA
  TWOFA_SEND = "/api/auth/2fa/send",
  TWOFA_VERIFY = "/api/auth/2fa/verify",
  TWOFA_STATUS = "/api/auth/2fa/status",

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
