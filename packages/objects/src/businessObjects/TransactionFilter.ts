import { ChainTransaction } from "@objects/businessObjects";
import {
  ChainId,
  AccountAddress,
  TransactionHash,
  UnixTimestamp,
} from "@objects/primitives";

export class TransactionFilter {
  public chainIDs?: Set<ChainId>;
  public hashes?: Set<string>;
  public addresses?: Set<string>;

  public constructor(
    chainIDs?: ChainId[],
    addresses?: AccountAddress[],
    hashes?: TransactionHash[],
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

  public matches(tx: ChainTransaction): boolean {
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

  private _getDescendants(obj): Set<string> {
    let result = new Set<string>();
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object") {
        result = new Set([...result, ...this._getDescendants(value)]);
      } else if (typeof value === "string") {
        result.add(value.toLowerCase());
      }
    }
    return result;
  }
}
