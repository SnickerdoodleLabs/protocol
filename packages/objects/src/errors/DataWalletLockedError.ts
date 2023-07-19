import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class DataWalletLockedError extends BaseError {
  protected errorCode: string = errorCodes[DataWalletLockedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[DataWalletLockedError.name], src, false);
  }
}
