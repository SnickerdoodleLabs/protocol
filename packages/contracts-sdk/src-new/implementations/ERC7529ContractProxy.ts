import { ERC7529ContractError } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERC7529Contract } from "@contracts-sdk/implementations/ERC7529Contract.js";
import { IERC7529Contract } from "@contracts-sdk/interfaces/index.js";

export class ERC7529ContractProxy
  extends ERC7529Contract<ERC7529ContractError>
  implements IERC7529Contract<ERC7529ContractError>
{
  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): ERC7529ContractError {
    return new ERC7529ContractError(msg, e, transaction);
  }
}
