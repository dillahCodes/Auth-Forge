import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // redirect_uris: [process.env.GOOGLE_REDIRECT_URI!, process.env.GOOGLE_REDIRECT_URI_CONNECT!],
});
