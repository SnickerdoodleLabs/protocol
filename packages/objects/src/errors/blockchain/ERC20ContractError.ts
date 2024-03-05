import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ERC20ContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[ERC20ContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[ERC20ContractError.name],
      src,
      transaction,
      false,
    );
  }
}
