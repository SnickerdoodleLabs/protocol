import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class GasTooLowError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[GasTooLowError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[GasTooLowError.name],
      err,
      transaction,
      false,
    );
  }
}
