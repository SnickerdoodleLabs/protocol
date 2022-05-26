import errorCodes from "@objects/errors/errorCodes";

export class OfferMismatchError extends Error {
  protected errorCode: string = errorCodes[OfferMismatchError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
