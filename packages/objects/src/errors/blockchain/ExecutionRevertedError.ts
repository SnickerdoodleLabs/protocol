import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ExecutionRevertedError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[ExecutionRevertedError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[ExecutionRevertedError.name],
      err,
      transaction,
      false,
    );
  }
}
