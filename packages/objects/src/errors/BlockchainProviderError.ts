import errorCodes from "@objects/errors/errorCodes";
import { ChainId } from "@objects/primatives";

export class BlockchainProviderError extends Error {
  protected errorCode: string = errorCodes[BlockchainProviderError.name];
  constructor(public chainId: ChainId, message?: string, public src?: unknown) {
    super(message);
  }
}
