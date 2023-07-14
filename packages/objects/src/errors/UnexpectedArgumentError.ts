import errorCodes from "@objects/errors/errorCodes.js";

export class UnexpectedArgumentError extends Error {
  protected errorCode: string = errorCodes[UnexpectedArgumentError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
