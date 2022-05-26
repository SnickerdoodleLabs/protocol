import errorCodes from "@objects/errors/errorCodes";

export class InvalidPaymentError extends Error {
  protected errorCode: string = errorCodes[InvalidPaymentError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
