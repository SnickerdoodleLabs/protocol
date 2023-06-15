import errorCodes from "@objects/errors/errorCodes.js";
import { ChainId } from "@objects/primitives/index.js";

export class BlockchainProviderError extends Error {
  protected errorCode: string = errorCodes[BlockchainProviderError.name];
  constructor(public chainId: ChainId, message?: string, public src?: unknown) {
    super(message);
  }
}
