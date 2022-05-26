import errorCodes from "@objects/errors/errorCodes";

export class BalancesUnavailableError extends Error {
  protected errorCode: string = errorCodes[BalancesUnavailableError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
