import errorCodes from "@objects/errors/errorCodes.js";
import { BaseBEError } from "@objects/errors/BaseBEError.js";

export class ExecutionRevertedError extends BaseBEError {
  protected errorCode: string = errorCodes[ExecutionRevertedError.name];
  constructor(message: string, public src: unknown) {
    super(message, 500, errorCodes[ExecutionRevertedError.name], src, false);
  }
}
