import errorCodes from "@objects/errors/errorCodes.js";
import { ChainId } from "@objects/primitives/index.js";

export class InsufficientFundsError extends Error {
  protected errorCode: string = errorCodes[InsufficientFundsError.name];
  public message;
  constructor(public chainId: ChainId, message: string, public src?: unknown) {
    super(message);
  }
}
