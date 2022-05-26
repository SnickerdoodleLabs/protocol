import errorCodes from "@objects/errors/errorCodes";

export class PaymentStakeError extends Error {
  protected errorCode: string = errorCodes[PaymentStakeError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
