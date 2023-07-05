import { OAuth2AccessToken, OAuth2RefreshToken } from "@snickerdoodlelabs/objects";

export interface DiscordOAuth2TokensAPIResponse {
  access_token: OAuth2AccessToken;
  token_type: string;
  expires_in: number; //ms
  refresh_token: OAuth2RefreshToken;
  scope: string;
}
