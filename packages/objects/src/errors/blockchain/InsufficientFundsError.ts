import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InsufficientFundsError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[InsufficientFundsError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[InsufficientFundsError.name],
      err,
      transaction,
      false,
    );
  }
}
