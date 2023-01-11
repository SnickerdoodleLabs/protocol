import errorCodes from "@objects/errors/errorCodes";

/**
 * This is the ultimate in generic errors
 */
export class DataWalletError extends Error {
  protected errorCode: string = errorCodes[DataWalletError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
