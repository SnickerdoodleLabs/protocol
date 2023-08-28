import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class BackupError extends BaseError {
  protected errorCode: string = errorCodes[BackupError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[BackupError.name], src, false);
  }
}
