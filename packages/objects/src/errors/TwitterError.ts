import errorCodes from "@objects/errors/errorCodes";
import { OAuthError } from "@objects/errors/OAuthError";

export class TwitterError extends OAuthError {
  protected errorCode: string = errorCodes[TwitterError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
