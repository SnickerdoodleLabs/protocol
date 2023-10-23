import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";
import { ProviderRpcError } from "@objects/errors/ProviderRpcError.js";

export class ERC721RewardContractError extends BaseError {
  protected errorCode: string = errorCodes[ERC721RewardContractError.name];
  constructor(
    message?: string,
    public reason?: string,
    public src?: ProviderRpcError | unknown,
  ) {
    super(
      `${message} ${(src as any)?.reason ? `: ${(src as any)?.reason}` : ``}`,
      500,
      errorCodes[ERC721RewardContractError.name],
      src,
      false,
    );
  }
}
