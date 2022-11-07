import { ChainTransaction, EVMEvent } from "@objects/businessObjects";
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
export class EVMTransaction extends ChainTransaction {
  public accountAddresses: EVMAccountAddress[] | null; // null safety necessary for old transactions

  public constructor(
    public chainId: ChainId,
    public hash: EVMTransactionHash,
    public timestamp: UnixTimestamp,
    public blockHeight: number | null,
    public to: EVMAccountAddress | null,
    public from: EVMAccountAddress | null,
    public value: BigNumberString | null,
    public gasPrice: BigNumberString | null,
    public gasOffered: BigNumberString | null,
    public feesPaid: BigNumberString | null,
    events: EVMEvent[] | null,
    public valueQuote: number | null,
  ) {
    super(chainId, hash, timestamp);
    const addrs = new Set<EVMAccountAddress>();
    if (events != null) {
      this._getDescendants(events);
    }
    if (this.to) {
      addrs.add(this.to);
    }
    if (this.from) {
      addrs.add(this.from);
    }
    this.accountAddresses = Array.from(addrs);
  }

  private _getDescendants(obj): Set<EVMAccountAddress> {
    let result = new Set<EVMAccountAddress>();
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object") {
        result = new Set([...result, ...this._getDescendants(value)]);
      } else {
        if (typeof value === "string") {
          result.add(EVMAccountAddress(value));
        }
      }
    }

    return result;
  }
}
