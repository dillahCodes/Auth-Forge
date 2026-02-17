export enum ClientRouters {
  LOGIN = "/login",
  REGISTER = "/register",
  FORGOT_PASSWORD = "/forgot-password",
  FORGOT_PASSWORD_VERIFY = "/forgot-password/verify",

  REVERT_ACCOUNT_PASSWORD = "/revert-account/password-change",
  REVERT_ACCOUNT_EMAIL = "/revert-account/email-change",

  PROFILE = "/profile",
  EDIT_PROFILE = "/profile/edit",
  DASHBOARD = "/dashboard",

  SESSION_REVOKED = "/session-revoked",
  UNAUTHORIZED = "/unauthorized",

  VERIFY_EMAIL = "/verify-email",
}

export const ClientPrivateRoutes = [ClientRouters.DASHBOARD, ClientRouters.PROFILE, ClientRouters.VERIFY_EMAIL];

export const AuthRoutes = [
  ClientRouters.LOGIN,
  ClientRouters.REGISTER,
  ClientRouters.FORGOT_PASSWORD,
  ClientRouters.FORGOT_PASSWORD_VERIFY,
];
