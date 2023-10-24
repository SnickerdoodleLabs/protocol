import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class DuplicateIdInSchema extends BaseError {
  protected errorCode: string = errorCodes[DuplicateIdInSchema.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[DuplicateIdInSchema.name], src, false);
  }
}
