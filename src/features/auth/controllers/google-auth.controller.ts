import { ClientRouters } from "@/routers/client-router";
import { googleClient } from "@/shared/lib/oauth/google.oauth";
import { sendSuccess } from "@/shared/utils/response-helper";
import { NextResponse } from "next/server";
import { ClientInfoHttp } from "../http/client-info.http";
import { GoogleAuthHttp } from "../http/google-auth.http";
import { GoogleAuthService } from "../services/google-auth.service";
import { CreateController } from "./create.controller";
import { CookieHttp } from "../http/cookie.http";

export const GoogleAuthController = {
  signIn: CreateController.create(async () => {
    const config = GoogleAuthService.generateAuthUrlConfig();
    const authUrl = googleClient.generateAuthUrl(config);
    return sendSuccess({ authUrl }, "Get google auth url successfully");
  }),

  callback: CreateController.create(async (req: Request) => {
    const redirectUrl = GoogleAuthHttp.validateCallbackError(req);
    if (redirectUrl) return NextResponse.redirect(new URL(redirectUrl, process.env.BASE_URL!));

    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);

    const code = await GoogleAuthHttp.validateUrlCode(req);
    const tokens = await GoogleAuthService.callbackAuth({ code, geo: geolocation, clientInfo });

    const dashboardUrl = new URL(ClientRouters.DASHBOARD, process.env.BASE_URL!);
    const response = NextResponse.redirect(dashboardUrl);

    googleClient.setCredentials(tokens.tokens);
    CookieHttp.set({ response, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    return response;
  }),
};
