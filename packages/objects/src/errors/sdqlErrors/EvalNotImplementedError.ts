import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class EvalNotImplementedError extends BaseError {
  protected errorCode: string = errorCodes[EvalNotImplementedError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[EvalNotImplementedError.name], src, false);
  }
}
