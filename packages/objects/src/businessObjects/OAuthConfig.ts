import { URLString } from "@objects/primitives/URLString";

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  oauthBaseUrl: URLString;
  oauthRedirectUrl: URLString;
  accessTokenUrl?: URLString;
  refreshTokenUrl?: URLString;
}
