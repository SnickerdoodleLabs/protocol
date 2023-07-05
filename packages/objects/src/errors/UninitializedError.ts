import errorCodes from "@objects/errors/errorCodes.js";

export class UninitializedError extends Error {
  protected errorCode: string = errorCodes[UninitializedError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
