import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class OAuthError extends BaseError {
  protected errorCode: string = errorCodes[OAuthError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[OAuthError.name], src, false);
  }
}
