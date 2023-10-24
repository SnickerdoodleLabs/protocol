import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class TransactionResponseError extends BaseError {
  protected errorCode: string = errorCodes[TransactionResponseError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[TransactionResponseError.name], src, false);
  }
}
