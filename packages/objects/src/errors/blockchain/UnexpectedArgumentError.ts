import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class UnexpectedArgumentError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[UnexpectedArgumentError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[UnexpectedArgumentError.name],
      err,
      transaction,
      false,
    );
  }
}
