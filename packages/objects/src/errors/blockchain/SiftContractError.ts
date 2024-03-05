import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class SiftContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[SiftContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[SiftContractError.name],
      src,
      transaction,
      false,
    );
  }
}
