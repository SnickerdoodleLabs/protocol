import errorCodes from "@objects/errors/errorCodes";

export class DataWalletLockedError extends Error {
  protected errorCode: string = errorCodes[DataWalletLockedError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
