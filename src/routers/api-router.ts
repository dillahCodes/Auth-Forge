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

  // USERS
  USERS_BYID = "/api/users/:userId",
}
