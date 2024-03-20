import { ethers } from "ethers";

import { BaseBlockchainTransactionError } from "@objects/errors/blockchain/BaseBlockchainTransactionError.js";
import errorCodes from "@objects/errors/errorCodes.js";

export class ERC1155ContractError extends BaseBlockchainTransactionError {
  protected errorCode: string = errorCodes[ERC1155ContractError.name];
  constructor(
    message: string,
    src: unknown | null,
    transaction: ethers.Transaction | null,
  ) {
    super(
      message,
      500,
      errorCodes[ERC1155ContractError.name],
      src,
      transaction,
      false,
    );
  }
}
