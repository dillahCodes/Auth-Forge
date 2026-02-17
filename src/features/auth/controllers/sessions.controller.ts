import { sendSuccess } from "@/shared/utils/response-helper";
import { AccessTokenHttp } from "../http/access-token.http";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { RefreshTokenHttp } from "../http/refresh-token.http";
import { sessionsMapping } from "../mapping/session.mapping";
import { SessionService } from "../services/session.service";
import { CreateController } from "./create.controller";

type RevokeByIdParams = RouteContext<"/api/auth/sessions/[sessionId]">;

export const SessionsController = {
  // DOC: refresh token if access token is expired
  refreshToken: CreateController.create(async (req: Request) => {
    // DOC: validate refresh token  and session
    const { sessionId } = await RefreshTokenHttp.requireValidRefreshToken(req);
    const { userId } = await SessionService.validateSessionForRefresh(sessionId);

    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);

    const args = { sessionId, userId, clientInfo, geolocation };
    const { accessToken, refreshToken } = await SessionService.refreshToken(args);

    const response = sendSuccess(null, "Refresh token successfully");

    // DOC: set auth cookies in client browser
    CookieHttp.set({ response, accessToken, refreshToken });
    return response;
  }),

  // DOC: get all active sessions
  getAllSessions: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    await SessionService.validateSessionForAccessToken(sessionId);
    const sessions = await SessionService.getActiveSessionsByUserId(userId);
    const mappedSessions = sessionsMapping(sessions, sessionId);

    return sendSuccess(mappedSessions, "Get active sessions successfully");
  }),

  // DOC: revoke all sessions by user id
  revokeAll: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    await SessionService.validateSessionForAccessToken(sessionId);
    await SessionService.revokeAllByUserId(userId, { exceptSessionId: sessionId });

    const response = sendSuccess(null, "Revoke all sessions successfully");
    return response;
  }),

  // DOC: get gruped session count
  count: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    await SessionService.validateSessionForAccessToken(sessionId);
    const sessionCount = await SessionService.countSessionsByRevocationStatus(userId);

    return sendSuccess(sessionCount, "Get session count successfully");
  }),

  // DOC: revoke session by se
  revokeById: CreateController.create(async (req: Request, { params }: RevokeByIdParams) => {
    const { sessionId: sessionIdTobeRevoke } = await params;
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    await SessionService.validateSessionForAccessToken(sessionId);
    await SessionService.revokeSessionChainBySessionid({ userId, sessionIdTobeRevoke });
    return sendSuccess(null, "Revoke session successfully");
  }),
};
