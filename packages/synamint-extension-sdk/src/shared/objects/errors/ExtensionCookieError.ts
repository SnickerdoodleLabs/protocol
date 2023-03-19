import errorCodes from "@synamint-extension-sdk/shared/objects/errors/errorCodes";

export class ExtensionCookieError extends Error {
  protected errorCode: string = errorCodes[ExtensionCookieError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
