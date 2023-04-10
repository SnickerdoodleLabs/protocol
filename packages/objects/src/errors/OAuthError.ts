import errorCodes from "@objects/errors/errorCodes";

export class OAuthError extends Error {
  protected errorCode: string = errorCodes[OAuthError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
