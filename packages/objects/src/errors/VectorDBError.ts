import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class VectorDBError extends BaseError {
  protected errorCode: string = errorCodes[VectorDBError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[VectorDBError.name], src, false);
  }
}
