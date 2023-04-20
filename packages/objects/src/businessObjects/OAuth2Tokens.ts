import {
  DiscordAccessToken,
  DiscordRefreshToken,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class OAuth2Tokens {
  public constructor(
    public accessToken: DiscordAccessToken,
    public refreshToken: DiscordRefreshToken,
    public expiry: UnixTimestamp,
  ) {}
}
