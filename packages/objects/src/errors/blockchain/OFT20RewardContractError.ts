import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class OFT20RewardContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[OFT20RewardContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[OFT20RewardContractError.name],
      src,
      transaction,
      false,
    );
  }
}
