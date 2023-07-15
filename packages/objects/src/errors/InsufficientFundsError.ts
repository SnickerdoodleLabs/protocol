import errorCodes from "@objects/errors/errorCodes.js";

export class InsufficientFundsError extends Error {
  protected errorCode: string = errorCodes[InsufficientFundsError.name];
  public message;
  constructor(message: string, public src?: unknown) {
    super(message);
  }
}
