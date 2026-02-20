import { AuthUnauthorized } from "@/shared/errors/auth-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import { googleClient } from "@/shared/lib/oauth/google.oauth";
import { GenerateAuthUrlOpts } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { AuthProvider } from "../../../../prisma/generated/enums";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from "./token.service";

interface CallbackParams {
  code: string;
  geo: Geolocation;
  clientInfo: ClientInfo;
}

export const GoogleAuthService = {
  generateAuthUrlConfig: (): GenerateAuthUrlOpts => {
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      // "https://www.googleapis.com/auth/photoslibrary.readonly",
      // "https://www.googleapis.com/auth/drive.readonly",
    ];

    const config: GenerateAuthUrlOpts = { access_type: "offline", prompt: "consent", scope: scope };
    return config;
  },

  // DOC: https://www.npmjs.com/package/google-auth-library
  async callbackAuth({ code, geo, clientInfo }: CallbackParams) {
    const { tokens } = await googleClient.getToken(code);

    // DOC: verify id token and get user info from token payload
    const verifyIdTokenArgs = { idToken: tokens.id_token as string, audience: process.env.GOOGLE_CLIENT_ID };
    const ticket = await googleClient.verifyIdToken(verifyIdTokenArgs);
    const tokenPaylaod = ticket.getPayload();

    if (!tokenPaylaod) throw new AuthUnauthorized("Invalid Google authentication token");

    // DOC: check user is performed login or register with google account
    const userByEmail = await UserRepository.getByEmail({ email: tokenPaylaod.email as string });
    const isUserLogin = !!userByEmail;

    const { email, name, sub, email_verified } = tokenPaylaod;

    const userId = isUserLogin ? userByEmail.id : uuidv4();
    const emailString = email as string;
    const nameString = name as string;
    const verifiedAt = email_verified ? new Date() : null;
    const provider = AuthProvider.GOOGLE;

    // DOC: if user not exist, create new user with google account
    if (!isUserLogin) {
      const userDataPayload = { name: nameString, email: emailString, password: "", verifiedAt, id: userId };
      const payloadAccount = { provider, providerAccountId: sub };
      await UserRepository.create({ userData: userDataPayload, userAccount: payloadAccount });
    }

    // if user login and not have account with google provider, create new account for user
    const isHasGoogleAccount = await UserRepository.getAccountByProviderId({ provider, providerAccountId: sub });

    if (!isHasGoogleAccount) {
      const payloadAccount = { provider, providerAccountId: sub, userId };
      await UserRepository.createAccount({ userId, accountData: payloadAccount });
    }

    // DOC: create session and tokens
    const sessionId = uuidv4();
    const accessTokenPayload: AccessTokenPayload = { userId, sessionId, verifiedAt, provider };
    const refreshTokenPayload: RefreshTokenPayload = { sessionId, provider };

    const { signAccessToken, signRefreshToken } = TokenService;
    const accessToken = await signAccessToken(accessTokenPayload);
    const refreshToken = await signRefreshToken(refreshTokenPayload);

    // DOC: store refresh tokens in database
    const payloadRefreshToken = { sessionId, refreshToken, userId, ...clientInfo, ...geo };
    await SessionRepository.storeSession(payloadRefreshToken);

    // DOC: store access token in redis database
    const payloadAccessToken = { sessionId, accessToken, userId };
    await SessionRepository.storeAccessTokenRedis(payloadAccessToken);

    return { googleTokens: tokens, accessToken, refreshToken };
  },
};
