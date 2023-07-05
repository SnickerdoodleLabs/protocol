import { BearerToken, TokenSecret } from "@objects/primitives/index.js";

export class TokenAndSecret {
  constructor(public token: BearerToken, public secret: TokenSecret) {}
}
