import errorCodes from "./errorCodes";

export class MobileCookieError extends Error {
  protected errorCode: string = errorCodes[MobileCookieError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
