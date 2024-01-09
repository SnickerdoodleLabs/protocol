import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ERC7529ContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[ERC7529ContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[ERC7529ContractError.name],
      src,
      transaction,
      false,
    );
  }
}
