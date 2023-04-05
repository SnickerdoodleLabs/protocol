import { BearerAuthToken, UnixTimestamp } from "@objects/primitives/index.js";

export interface DiscordOAuth2TokensAPIResponse {
  access_token: BearerAuthToken;
  token_type: string;
  expires_in: number; //ms
  refresh_token: BearerAuthToken;
  scope: string;
}

// export class DiscordAccessToken {
//   public constructor(
//     public access_token: BearerAuthToken,
//     public refresh_token: BearerAuthToken,
//     public expire_date: UnixTimestamp,
//   ) {}
// }
