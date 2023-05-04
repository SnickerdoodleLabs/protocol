import { Interface } from "ethers/lib/utils";

import { ChainTransaction } from "@objects/businessObjects/versioned/ChainTransaction";
import { EVMEvent } from "@objects/businessObjects/EVMEvent";
import {
  EVMFunctionParameter,
  EVMFunctionSignature,
} from "@objects/businessObjects/EVMFunctionSignature";
import {
  ChainId,
  EVMAccountAddress,
  BigNumberString,
  UnixTimestamp,
  EVMAccountAddressRegex,
  EVMTransactionHash,
  EVMContractAddress,
} from "@objects/primitives";

/**
 * This is a concrete implementation of the Transaction class from Ethers. I'd really prefer to not have to
 * import and depend on Ethers directly, but odds are any project that is using @snickerdoodlelabs/objects
 * is also importing Ethers.
 * Docs are here: https://docs.ethers.io/v5/api/utils/transactions/#Transaction
 */
export class EVMTransaction extends ChainTransaction {
  public accountAddresses: EVMAccountAddress[]; // null safety necessary for old transactions
  public functionSignature: EVMFunctionSignature | null = null;

  public constructor(
    public chainId: ChainId,
    public hash: EVMTransactionHash,
    public timestamp: UnixTimestamp,
    public blockHeight: number | null,
    public to: EVMAccountAddress | null,
    public from: EVMAccountAddress | null,
    public value: BigNumberString | null,
    public gasPrice: BigNumberString | null,
    public contractAddress: EVMContractAddress | null,
    public input: string | null,
    public methodId: string | null,
    public functionName: string | null,
    events: EVMEvent[] | null,
  ) {
    super(chainId, hash, timestamp);
    let addrs = new Set<EVMAccountAddress>();
    if (this.to) {
      addrs.add(this.to);
    }
    if (this.from) {
      addrs.add(this.from);
    }
    if (
      this.input &&
      this.functionName &&
      this.methodId &&
      !this.functionName.startsWith(this.methodId)
    ) {
      try {
        const iface = new Interface([`function ${this.functionName}`]);
        const func = iface.getFunction(this.input.slice(0, 10));
        const paramValues = iface.decodeFunctionData(func.name, this.input);

        // filter out unrecognized methodIDs
        // we may want to do a secondary lookup on failure here:
        // https://www.4byte.directory/docs/
        this.functionSignature = new EVMFunctionSignature(
          func.name,
          func.type,
          func.inputs.map((input, i) => {
            return new EVMFunctionParameter(
              input.name,
              input.type,
              paramValues[i],
            );
          }),
        );

        addrs = new Set([
          ...addrs,
          ...this._getDescendants(this.functionSignature),
        ]);
      } catch (e) {
        // this is also a bit noisy
        console.warn("error decoding transaction input", e);
      }
    }

    if (events) {
      addrs = new Set([...addrs, ...this._getDescendants(events)]);
    }

    this.accountAddresses = Array.from(addrs);
  }

  private _getDescendants(obj): Set<EVMAccountAddress> {
    let result = new Set<EVMAccountAddress>();
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object") {
        result = new Set([...result, ...this._getDescendants(value)]);
      } else {
        if (typeof value === "string" && value.match(EVMAccountAddressRegex)) {
          result.add(EVMAccountAddress(value));
        }
      }
    }

    return result;
  }
}
