import {
  DiscordAccessToken,
  DiscordRefreshToken,
} from "@objects/primitives/index.js";

export interface DiscordOAuth2TokensAPIResponse {
  access_token: DiscordAccessToken;
  token_type: string;
  expires_in: number; //ms
  refresh_token: DiscordRefreshToken;
  scope: string;
}
