import errorCodes from "@objects/errors/errorCodes.js";
import { OAuthError } from "@objects/errors/OAuthError.js";

export class TwitterError extends OAuthError {
  protected errorCode: string = errorCodes[TwitterError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
