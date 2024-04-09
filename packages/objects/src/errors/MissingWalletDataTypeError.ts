import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class MissingWalletDataTypeError extends BaseError {
  protected errorCode: string = errorCodes[MissingWalletDataTypeError.name];
  constructor(message: string, public src?: unknown) {
    super(
      `no wallet data type defined for ${message}`,
      500,
      errorCodes[MissingWalletDataTypeError.name],
      src,
      false,
    );
  }
}
