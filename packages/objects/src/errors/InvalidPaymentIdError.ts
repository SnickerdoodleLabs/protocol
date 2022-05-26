import errorCodes from "@objects/errors/errorCodes";

export class InvalidPaymentIdError extends Error {
  protected errorCode: string = errorCodes[InvalidPaymentIdError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
