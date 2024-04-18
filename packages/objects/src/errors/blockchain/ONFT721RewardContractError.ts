import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ONFT721RewardContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[ONFT721RewardContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[ONFT721RewardContractError.name],
      src,
      transaction,
      false,
    );
  }
}
