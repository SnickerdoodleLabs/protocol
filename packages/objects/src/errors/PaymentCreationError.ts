import errorCodes from "@objects/errors/errorCodes";

export class PaymentCreationError extends Error {
  protected errorCode: string = errorCodes[PaymentCreationError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
