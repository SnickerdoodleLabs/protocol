import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ProviderRpcError extends BaseError {
  protected errorCode: string = errorCodes[ProviderRpcError.name];
  constructor(message: string, public src?: unknown) {
    super(message, 500, errorCodes[ProviderRpcError.name], src, false);
  }
}
