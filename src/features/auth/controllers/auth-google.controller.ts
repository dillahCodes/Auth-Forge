import { ClientRouters } from "@/routers/client-router";
import { googleClient } from "@/shared/lib/oauth/google.oauth";
import { sendSuccess } from "@/shared/utils/response-helper";
import { NextResponse } from "next/server";
import { ClientInfoHttp } from "../http/client-info.http";
import { AuthGoogleHttp } from "../http/auth-google.http";
import { AuthGoogleService } from "../services/auth-google.service";
import { CreateController } from "./create.controller";
import { CookieHttp } from "../http/cookie.http";
import { AccessTokenHttp } from "../http/access-token.http";
import { TwoFaHttp } from "../http/2fa.http";

export const AuthGoogleController = {
  signIn: CreateController.create(async () => {
    const config = AuthGoogleService.generateoAuthUrlConfig({ forEndpoint: "AUTH" });
    const authUrl = googleClient.generateAuthUrl(config);
    return sendSuccess({ authUrl }, "Get google auth url successfully");
  }),

  callback: CreateController.create(async (req: Request) => {
    const redirectUrl = AuthGoogleHttp.validateCallbackError(req);
    if (redirectUrl) return NextResponse.redirect(new URL(redirectUrl, process.env.BASE_URL!));

    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);

    const code = await AuthGoogleHttp.validateUrlCode(req);
    const tokens = await AuthGoogleService.callbackAuth({ code, geo: geolocation, clientInfo });

    const redirectTo = AuthGoogleHttp.getRedirectUrlAfterAuth(req);
    const response = NextResponse.redirect(redirectTo);

    googleClient.setCredentials(tokens.googleTokens);
    CookieHttp.set({ response, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    return response;
  }),

  toggleConnection: CreateController.create(async (req: Request) => {
    await AccessTokenHttp.requiredAccessToken(req);
    await TwoFaHttp.requiredTwoFaToken(req, "TOGGLE_GOOGLE_CONNECTION");

    const config = AuthGoogleService.generateoAuthUrlConfig({
      redirectAfterAuthTo: ClientRouters.EDIT_PROFILE,
      forEndpoint: "CONNECT",
    });

    const authUrl = googleClient.generateAuthUrl(config);
    return sendSuccess({ authUrl }, "Get google auth url successfully");
  }),

  toggleConnectionCallback: CreateController.create(async (req: Request) => {
    const { provider, userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    const redirectUrl = AuthGoogleHttp.validateCallbackError(req);
    if (redirectUrl) return NextResponse.redirect(new URL(redirectUrl, process.env.BASE_URL!));

    const code = await AuthGoogleHttp.validateUrlCode(req);
    const connectionArgs = { code, currentProvider: provider, currentUserId: userId, currentSessionId: sessionId };

    const resultParams = await AuthGoogleService.connectionCallback(connectionArgs);
    const redirectTo = AuthGoogleHttp.getRedirectUrlAfterAuth(req, resultParams);
    const response = NextResponse.redirect(redirectTo);

    CookieHttp.clearByName(response, "2fa_token");
    return response;
  }),
};
