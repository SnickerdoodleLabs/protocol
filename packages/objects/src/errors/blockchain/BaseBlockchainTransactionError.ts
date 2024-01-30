import { ethers } from "ethers";

import { BaseError } from "@objects/errors/BaseError.js";

export abstract class BaseBlockchainTransactionError extends BaseError {
  constructor(
    message: string,
    code: number,
    type: string,
    src: unknown,
    public transaction: ethers.Transaction | null,
    retryable = false,
  ) {
    super(message, code, type, src, retryable);
  }
}
