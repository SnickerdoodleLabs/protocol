import { EVMEvent } from "@objects/businessObjects";
import {
  ChainId,
  EVMAccountAddress,
  BigNumberString,
  UnixTimestamp,
} from "@objects/primitives";

/**
 * This is a concrete implementation of the Transaction class from Ethers. I'd really prefer to not have to
 * import and depend on Ethers directly, but odds are any project that is using @snickerdoodlelabs/objects
 * is also importing Ethers.
 * Docs are here: https://docs.ethers.io/v5/api/utils/transactions/#Transaction
 */
export class EVMTransaction {
  public constructor(
    public chainId: ChainId,
    public hash: string,
    public timestamp: UnixTimestamp,
    public blockHeight: number | null,
    public to: EVMAccountAddress | null,
    public from: EVMAccountAddress | null,
    public value: BigNumberString | null,
    public gasPrice: BigNumberString | null,
    public gasOffered: BigNumberString | null,
    public feesPaid: BigNumberString | null,
    public events: EVMEvent[] | null,
    public valueQuote: number | null,
  ) {}
}

export class EVMTransactionFilter {
  public chainIDs?: Set<ChainId>;
  public hashes?: Set<string>;
  public addresses?: Set<string>;

  public constructor(
    chainIDs?: ChainId[],
    addresses?: EVMAccountAddress[],
    hashes?: string[],
    public startTime?: UnixTimestamp,
    public endTime?: UnixTimestamp,
  ) {
    if (chainIDs != undefined) {
      this.chainIDs = new Set(chainIDs);
    }
    if (hashes != undefined) {
      this.hashes = new Set(hashes.map((x) => x.toLowerCase()));
    }
    if (addresses != undefined) {
      this.addresses = new Set(addresses.map((x) => x.toLowerCase()));
    }
  }

  public matches(tx: EVMTransaction): boolean {
    if (this.chainIDs != undefined && !this.chainIDs.has(tx.chainId)) {
      return false;
    }
    if (this.hashes != undefined && !this.hashes.has(tx.hash.toLowerCase())) {
      return false;
    }

    if (this.startTime != undefined && this.startTime > tx.timestamp) {
      return false;
    }
    if (this.endTime != undefined && this.endTime < tx.timestamp) {
      return false;
    }

    if (this.addresses != undefined) {
      const txaddrs = Array.from(this._getDescendants(tx));

      if (txaddrs.length == 0) {
        return false;
      }

      if (!txaddrs.some((addr) => this.addresses?.has(addr))) {
        return false;
      }
    }

    return true;
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
