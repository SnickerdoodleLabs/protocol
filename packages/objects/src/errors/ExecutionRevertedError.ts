import errorCodes from "@objects/errors/errorCodes.js";

export class ExecutionRevertedError extends Error {
  protected errorCode: string = errorCodes[ExecutionRevertedError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
