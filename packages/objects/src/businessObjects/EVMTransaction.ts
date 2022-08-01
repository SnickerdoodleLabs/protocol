import { EVMEvent } from "./EVMEvent";

import {
  ChainId,
  EVMAccountAddress,
  BigNumberString,
} from "@objects/primitives";
import { UnixTimestamp } from "@objects/primitives";

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
      this.hashes = new Set(hashes);
    }
    if (addresses != undefined) {
      this.addresses = new Set(addresses);
    }
  }

  public matches(tx: EVMTransaction): boolean {
    if (this.chainIDs != undefined && !this.chainIDs.has(tx.chainId)) {
      return false;
    }
    if (this.hashes != undefined && !this.hashes.has(tx.hash)) {
      return false;
    }

    if (this.startTime != undefined && this.startTime > tx.timestamp) {
      return false;
    }
    if (this.endTime != undefined && this.endTime < tx.timestamp) {
      return false;
    }

    if (this.addresses != undefined) {
      const txaddrs = [...(tx.to ?? []), ...(tx.from ?? [])];
      if (txaddrs.length == 0) {
        return false;
      }

      if (!txaddrs.some((addr) => this.addresses?.has(addr))) {
        return false;
      }
    }

    return true;
  }
}
