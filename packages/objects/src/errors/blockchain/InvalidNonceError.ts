import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidNonceError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[InvalidNonceError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[InvalidNonceError.name],
      err,
      transaction,
      true,
    );
  }
}
