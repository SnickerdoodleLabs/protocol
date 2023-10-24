import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class EvaluationError extends BaseError {
  protected errorCode: string = errorCodes[EvaluationError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[EvaluationError.name], src, false);
  }
}
