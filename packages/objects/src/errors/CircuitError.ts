import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class CircuitError extends BaseError {
  protected errorCode: string = errorCodes[CircuitError.name];
  constructor(
    message: string,
    public src?: unknown,
  ) {
    super(message, 500, errorCodes[CircuitError.name], src, false);
  }
}
