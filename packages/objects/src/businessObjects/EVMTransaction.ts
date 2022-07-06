import { ethers, Transaction } from "ethers";

import { ChainId, EVMAccountAddress } from "@objects/primitives";

/**
 * This is a concrete implementation of the Transaction class from Ethers. I'd really prefer to not have to
 * import and depend on Ethers directly, but odds are any project that is using @snickerdoodlelabs/objects
 * is also importing Ethers.
 * Docs are here: https://docs.ethers.io/v5/api/utils/transactions/#Transaction
 */
export class EVMTransaction implements Transaction {
  public constructor(
    public chainId: ChainId,
    public nonce: number,
    public gasLimit: ethers.BigNumber,
    public data: string,
    public value: ethers.BigNumber,
  ) {}

  public hash?: string | undefined;
  public to?: EVMAccountAddress | undefined;
  public from?: EVMAccountAddress | undefined;
  public gasPrice?: ethers.BigNumber | undefined;
  public r?: string | undefined;
  public s?: string | undefined;
  public v?: number | undefined;
  public type?: number | null | undefined;
  public accessList?: ethers.utils.AccessList | undefined;
  public maxPriorityFeePerGas?: ethers.BigNumber | undefined;
  public maxFeePerGas?: ethers.BigNumber | undefined;
}
