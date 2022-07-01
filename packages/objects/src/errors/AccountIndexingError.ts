import errorCodes from "@objects/errors/errorCodes";

export class AccountIndexingError extends Error {
  protected errorCode: string = errorCodes[AccountIndexingError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
