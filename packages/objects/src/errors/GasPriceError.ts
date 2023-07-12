import errorCodes from "@objects/errors/errorCodes.js";

export class GasPriceError extends Error {
  protected errorCode: string = errorCodes[GasPriceError.name];
  constructor(message = "Error retrieving gas price", public src?: unknown) {
    super(message);
  }
}
