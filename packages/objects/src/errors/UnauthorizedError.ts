import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class UnauthorizedError extends BaseError {
  protected errorCode: string = errorCodes[UnauthorizedError.name];
  constructor(message: string, public src?: unknown) {
    super(
      message || "Insufficient permissions for operation",
      500,
      errorCodes[UnauthorizedError.name],
      src,
      false,
    );
  }
}
