import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class CloudStorageError extends BaseError {
  protected errorCode: string = errorCodes[CloudStorageError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[CloudStorageError.name], src, false);
  }
}
