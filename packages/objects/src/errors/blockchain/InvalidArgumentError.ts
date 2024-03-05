import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidArgumentError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[InvalidArgumentError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[InvalidArgumentError.name],
      err,
      transaction,
      false,
    );
  }
}
