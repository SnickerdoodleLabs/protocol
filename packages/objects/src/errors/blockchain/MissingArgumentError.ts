import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class MissingArgumentError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[MissingArgumentError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[MissingArgumentError.name],
      err,
      transaction,
      false,
    );
  }
}
