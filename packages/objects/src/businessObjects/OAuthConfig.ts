import { TokenSecret, URLString } from "@objects/primitives/index.js";

export interface OAuthConfig {
  clientId: string;
  clientSecret: TokenSecret;
  oauthBaseUrl: URLString;
  oauthRedirectUrl: URLString;
  accessTokenUrl?: URLString;
  refreshTokenUrl?: URLString;
}
