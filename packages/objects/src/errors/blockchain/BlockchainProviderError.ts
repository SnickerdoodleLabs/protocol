import { EChain } from "@objects/enum/index.js";
import { BaseError } from "@objects/errors/BaseError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class BlockchainProviderError extends BaseError {
  protected errorCode: string = errorCodes[BlockchainProviderError.name];
  constructor(public chain: EChain, message: string, public src?: unknown) {
    super(message, 500, errorCodes[BlockchainProviderError.name], src, false);
  }
}
