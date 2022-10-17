import { EVMEvent } from "@objects/businessObjects";
import { IChainTransaction } from "@objects/interfaces/IChainTransaction";
import {
  ChainId,
  EVMAccountAddress,
  BigNumberString,
  UnixTimestamp,
  EVMAccountAddressRegex,
  EVMTransactionHash,
} from "@objects/primitives";

/**
 * This is a concrete implementation of the Transaction class from Ethers. I'd really prefer to not have to
 * import and depend on Ethers directly, but odds are any project that is using @snickerdoodlelabs/objects
 * is also importing Ethers.
 * Docs are here: https://docs.ethers.io/v5/api/utils/transactions/#Transaction
 */
export class EVMTransaction implements IChainTransaction {
  public constructor(
    public chainId: ChainId,
    public hash: EVMTransactionHash,
    public timestamp: UnixTimestamp,
    public blockHeight: number | null,
    public to: EVMAccountAddress | null,
    public from: EVMAccountAddress | null,
    public value: BigNumberString,
    public gasPrice: BigNumberString | null,
    public gasOffered: BigNumberString | null,
    public feesPaid: BigNumberString | null,
    public events: EVMEvent[] | null,
    public valueQuote: number | null,
  ) {}
}
