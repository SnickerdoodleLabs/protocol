import errorCodes from "@objects/errors/errorCodes.js";
import { ProviderRpcError } from "@objects/errors/ProviderRpcError.js";
import { BaseError } from "@objects/errors/BaseError.js";

export class MinimalForwarderContractError extends BaseError {
  protected errorCode: string = errorCodes[MinimalForwarderContractError.name];
  constructor(
    message?: string,
    public reason?: string,
    public src?: ProviderRpcError | unknown,
  ) {
    super(
      `${message} ${(src as any)?.reason ? `: ${(src as any)?.reason}` : ``}`,
      500,
      errorCodes[MinimalForwarderContractError.name],
      src,
      false,
    );
  }
}
