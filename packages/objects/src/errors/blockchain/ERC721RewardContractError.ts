import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ERC721RewardContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[ERC721RewardContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[ERC721RewardContractError.name],
      src,
      transaction,
      false,
    );
  }
}
