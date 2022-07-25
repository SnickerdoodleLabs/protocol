import errorCodes from "@objects/errors/errorCodes";

export class AccountBalanceError extends Error {
  protected errorCode: string = errorCodes[AccountBalanceError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
