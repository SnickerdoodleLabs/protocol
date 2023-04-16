import { BearerAuthToken, TokenSecret } from "@objects/primitives/index.js";

export interface ITokenAndSecret {
  token: BearerAuthToken;
  secret: TokenSecret;
}
