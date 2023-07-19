import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ExecutionRevertedError extends BaseError {
  protected errorCode: string = errorCodes[ExecutionRevertedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ExecutionRevertedError.name], src, false);
  }
}
