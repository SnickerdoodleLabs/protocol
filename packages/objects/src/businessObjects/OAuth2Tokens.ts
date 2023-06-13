import {
  OAuth2AccessToken,
  OAuth2RefreshToken,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class OAuth2Tokens {
  public constructor(
    public accessToken: OAuth2AccessToken,
    public refreshToken: OAuth2RefreshToken,
    public expiry: UnixTimestamp,
  ) {}
}
