import errorCodes from "@objects/errors/errorCodes.js";
import { BaseError } from "@objects/errors/BaseError.js";
import { ChainId } from "@objects/primitives/index.js";
export class BlockchainProviderError extends BaseError {
  protected errorCode: string = errorCodes[BlockchainProviderError.name];
  constructor(public chainId: ChainId, message: string, public src?: unknown) {
    super(message, 500, errorCodes[BlockchainProviderError.name], src, false);
  }
}
