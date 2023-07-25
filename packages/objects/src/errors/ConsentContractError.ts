import errorCodes from "@objects/errors/errorCodes.js";
import { ProviderRpcError } from "@objects/errors/ProviderRpcError.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class ConsentContractError extends BaseError {
  protected errorCode: string = errorCodes[ConsentContractError.name];
  constructor(
    message?: string,
    public reason?: string,
    public src?: ProviderRpcError | unknown,
  ) {
    super(
      `${message} ${(src as any)?.reason ? `: ${(src as any)?.reason}` : ``}`,
      500,
      errorCodes[ConsentContractError.name],
      src,
      false,
    );
  }
}
