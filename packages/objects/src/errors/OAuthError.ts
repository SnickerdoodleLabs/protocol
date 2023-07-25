import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class OAuthError extends BaseError {
  protected errorCode: string = errorCodes[OAuthError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[OAuthError.name], src, false);
  }
}
