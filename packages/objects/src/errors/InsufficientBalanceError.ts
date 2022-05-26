import errorCodes from "@objects/errors/errorCodes";

export class InsufficientBalanceError extends Error {
  protected errorCode: string = errorCodes[InsufficientBalanceError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
