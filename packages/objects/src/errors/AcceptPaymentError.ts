import errorCodes from "@objects/errors/errorCodes";

export class AcceptPaymentError extends Error {
  protected errorCode: string = errorCodes[AcceptPaymentError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
