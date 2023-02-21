import { URLString } from "@objects/primitives/URLString";

export interface OAuthConfig {
  clientId: string;
  oauthBaseUrl: URLString;
  oauthRedirectUrl: URLString;
  accessTokenUrl?: URLString;
  refreshTokenUrl?: URLString;
}
