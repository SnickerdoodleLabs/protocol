import errorCodes from "@objects/errors/errorCodes";

export class GasPriceError extends Error {
  protected errorCode: string = errorCodes[GasPriceError.name];
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
