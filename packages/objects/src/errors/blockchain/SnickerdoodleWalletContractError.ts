import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class SnickerdoodleWalletContractError extends BaseBlockchainTransactionError {
  protected errorCode: string =
    errorCodes[SnickerdoodleWalletContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[SnickerdoodleWalletContractError.name],
      src,
      transaction,
      false,
    );
  }
}
