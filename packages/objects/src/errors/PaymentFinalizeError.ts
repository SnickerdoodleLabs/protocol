import errorCodes from "@objects/errors/errorCodes";

export class PaymentFinalizeError extends Error {
  protected errorCode: string = errorCodes[PaymentFinalizeError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
