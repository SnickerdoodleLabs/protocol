import errorCodes from "./errorCodes";

export class MobileStorageError extends Error {
  protected errorCode: string = errorCodes[MobileStorageError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
