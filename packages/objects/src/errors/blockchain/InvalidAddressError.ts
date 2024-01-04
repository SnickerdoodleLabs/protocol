import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class InvalidAddressError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[InvalidAddressError.name];
  constructor(message: string, err: unknown, transaction: ethers.Transaction) {
    super(
      message,
      500,
      errorCodes[InvalidAddressError.name],
      err,
      transaction,
      false,
    );
  }
}
