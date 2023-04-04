import { BearerAuthToken, UnixTimestamp } from "@objects/primitives/index.js";

export class OAuth2Tokens {
  public constructor(
    public accessToken: BearerAuthToken,
    public refreshToken: BearerAuthToken,
    public expiry: UnixTimestamp,
  ) {}
}
