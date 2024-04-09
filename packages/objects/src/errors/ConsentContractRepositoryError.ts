import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ConsentContractRepositoryError extends BaseError {
  protected errorCode: string = errorCodes[ConsentContractRepositoryError.name];
  constructor(message: string, public src?: unknown) {
    super(
      message,
      500,
      errorCodes[ConsentContractRepositoryError.name],
      src,
      false,
    );
  }
}
