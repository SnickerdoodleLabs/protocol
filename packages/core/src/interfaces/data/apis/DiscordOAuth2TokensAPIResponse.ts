import { DiscordAccessToken, DiscordRefreshToken } from "@snickerdoodlelabs/objects";

export interface DiscordOAuth2TokensAPIResponse {
  access_token: DiscordAccessToken;
  token_type: string;
  expires_in: number; //ms
  refresh_token: DiscordRefreshToken;
  scope: string;
}
